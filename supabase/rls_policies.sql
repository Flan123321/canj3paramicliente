-- ============================================================
-- 🔐 CANJEPARAMICLIENTE - Row Level Security (RLS) Policies
-- ============================================================
-- Ejecutar en Supabase SQL Editor (Settings > SQL Editor)
-- ============================================================

-- ============================================================
-- 1️⃣ TABLA: users
-- ============================================================

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING (auth.uid()::text = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid()::text = id);

-- Política: Los usuarios autenticados pueden ver perfiles públicos (nombre, avatar)
CREATE POLICY "Authenticated users can view public profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- ============================================================
-- 2️⃣ TABLA: properties
-- ============================================================

-- Habilitar RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede ver propiedades activas (públicas)
CREATE POLICY "Anyone can view active properties"
ON public.properties
FOR SELECT
USING (status = 'ACTIVE' AND is_available = true);

-- Política: Los propietarios pueden ver todas sus propiedades
CREATE POLICY "Owners can view all own properties"
ON public.properties
FOR SELECT
USING (auth.uid()::text = owner_id);

-- Política: Los propietarios pueden crear propiedades
CREATE POLICY "Authenticated users can create properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = owner_id);

-- Política: Los propietarios pueden actualizar sus propiedades
CREATE POLICY "Owners can update own properties"
ON public.properties
FOR UPDATE
USING (auth.uid()::text = owner_id);

-- Política: Los propietarios pueden eliminar sus propiedades
CREATE POLICY "Owners can delete own properties"
ON public.properties
FOR DELETE
USING (auth.uid()::text = owner_id);

-- ============================================================
-- 3️⃣ TABLA: property_images
-- ============================================================

-- Habilitar RLS
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede ver imágenes de propiedades activas
CREATE POLICY "Anyone can view property images"
ON public.property_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND (properties.status = 'ACTIVE' OR properties.owner_id = auth.uid()::text)
  )
);

-- Política: Los propietarios pueden gestionar imágenes de sus propiedades
CREATE POLICY "Owners can insert property images"
ON public.property_images
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND properties.owner_id = auth.uid()::text
  )
);

CREATE POLICY "Owners can update property images"
ON public.property_images
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND properties.owner_id = auth.uid()::text
  )
);

CREATE POLICY "Owners can delete property images"
ON public.property_images
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_images.property_id 
    AND properties.owner_id = auth.uid()::text
  )
);

-- ============================================================
-- 4️⃣ TABLA: requirements (Requerimientos de búsqueda)
-- ============================================================

-- Habilitar RLS
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden ver requerimientos activos
CREATE POLICY "Authenticated users can view active requirements"
ON public.requirements
FOR SELECT
TO authenticated
USING (is_active = true);

-- Política: Los usuarios pueden ver todos sus propios requerimientos
CREATE POLICY "Users can view own requirements"
ON public.requirements
FOR SELECT
USING (auth.uid()::text = user_id);

-- Política: Los usuarios pueden crear requerimientos
CREATE POLICY "Authenticated users can create requirements"
ON public.requirements
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

-- Política: Los usuarios pueden actualizar sus requerimientos
CREATE POLICY "Users can update own requirements"
ON public.requirements
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Política: Los usuarios pueden eliminar sus requerimientos
CREATE POLICY "Users can delete own requirements"
ON public.requirements
FOR DELETE
USING (auth.uid()::text = user_id);

-- ============================================================
-- 5️⃣ TABLA: matches
-- ============================================================

-- Habilitar RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver matches de sus propiedades
CREATE POLICY "Users can view matches for own properties"
ON public.matches
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = matches.property_id 
    AND properties.owner_id = auth.uid()::text
  )
);

-- Política: Los usuarios pueden ver matches de sus requerimientos
CREATE POLICY "Users can view matches for own requirements"
ON public.matches
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.requirements 
    WHERE requirements.id = matches.requirement_id 
    AND requirements.user_id = auth.uid()::text
  )
);

-- Política: Los usuarios pueden actualizar matches relacionados a ellos
CREATE POLICY "Users can update own matches"
ON public.matches
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = matches.property_id 
    AND properties.owner_id = auth.uid()::text
  )
  OR
  EXISTS (
    SELECT 1 FROM public.requirements 
    WHERE requirements.id = matches.requirement_id 
    AND requirements.user_id = auth.uid()::text
  )
);

-- ============================================================
-- ✅ VERIFICACIÓN
-- ============================================================
-- Ejecutar esto para verificar que RLS está habilitado:

SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'properties', 'property_images', 'requirements', 'matches');

-- ============================================================
-- 📝 NOTAS IMPORTANTES:
-- ============================================================
-- 1. Estas políticas asumen que el 'id' del usuario corresponde al UID de Supabase Auth
-- 2. Los campos "shadow" (archerFlag, isDistressed, opportunityScore, internalNotes)
--    NO son accesibles directamente - solo via backend con service_role key
-- 3. Para operaciones administrativas, usa SUPABASE_SERVICE_ROLE_KEY en el backend
-- ============================================================
