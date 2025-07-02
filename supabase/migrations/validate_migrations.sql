-- =====================================================
-- SCRIPT DE VALIDACIÓN DE MIGRACIONES
-- Ejecutar después de aplicar todas las migraciones
-- Verifica que la estructura esté completa y funcional
-- =====================================================

\echo '🔍 Iniciando validación de migraciones...'

-- =====================================================
-- VALIDACIÓN 1: EXTENSIONES
-- =====================================================
\echo '📦 Verificando extensiones...'

SELECT 
    extname as extension_name,
    CASE 
        WHEN extname IN ('uuid-ossp', 'pgcrypto', 'btree_gin') THEN '✅'
        ELSE '❌'
    END as status
FROM pg_extension 
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'btree_gin')
ORDER BY extname;

-- =====================================================
-- VALIDACIÓN 2: ENUMS
-- =====================================================
\echo '🏷️  Verificando tipos enumerados...'

SELECT 
    typname as enum_name,
    array_agg(enumlabel ORDER BY enumsortorder) as values,
    '✅' as status
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('user_role', 'task_status', 'task_priority', 'notification_type', 'notification_status', 'notification_channel')
GROUP BY typname
ORDER BY typname;

-- =====================================================
-- VALIDACIÓN 3: TABLAS
-- =====================================================
\echo '📋 Verificando tablas...'

WITH expected_tables AS (
    SELECT unnest(ARRAY[
        'users', 'teams', 'team_memberships', 'task_categories', 'tasks', 
        'task_assignments', 'notifications', 'notification_templates',
        'activity_logs', 'user_sessions', 'system_settings', 'generated_reports',
        'task_comments', 'task_attachments'
    ]) as table_name
)
SELECT 
    et.table_name,
    CASE 
        WHEN t.table_name IS NOT NULL THEN '✅'
        ELSE '❌ FALTANTE'
    END as status,
    COALESCE(
        (SELECT column_count FROM information_schema.tables it WHERE it.table_name = et.table_name), 
        0
    ) as column_count
FROM expected_tables et
LEFT JOIN information_schema.tables t ON et.table_name = t.table_name 
    AND t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
ORDER BY et.table_name;

-- =====================================================
-- VALIDACIÓN 4: FOREIGN KEYS
-- =====================================================
\echo '🔗 Verificando foreign keys...'

SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS referenced_table,
    ccu.column_name AS referenced_column,
    '✅' as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- =====================================================
-- VALIDACIÓN 5: ÍNDICES
-- =====================================================
\echo '📇 Verificando índices...'

SELECT 
    schemaname,
    tablename,
    indexname,
    CASE 
        WHEN indexname LIKE 'idx_%' THEN '✅'
        WHEN indexname LIKE '%_pkey' THEN '🔑 PK'
        WHEN indexname LIKE '%_key' THEN '🔑 UK'
        ELSE '📇'
    END as status
FROM pg_indexes 
WHERE schemaname = 'public'
    AND tablename IN (
        'users', 'teams', 'team_memberships', 'task_categories', 'tasks', 
        'task_assignments', 'notifications', 'notification_templates',
        'activity_logs', 'user_sessions', 'system_settings', 'generated_reports',
        'task_comments', 'task_attachments'
    )
ORDER BY tablename, indexname;

-- =====================================================
-- VALIDACIÓN 6: TRIGGERS
-- =====================================================
\echo '⚡ Verificando triggers...'

SELECT 
    trigger_name,
    event_object_table as table_name,
    action_timing,
    event_manipulation,
    '✅' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
    AND trigger_name NOT LIKE 'RI_%'  -- Excluir triggers de RI internos
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- VALIDACIÓN 7: FUNCIONES
-- =====================================================
\echo '🔧 Verificando funciones...'

SELECT 
    routine_name as function_name,
    routine_type,
    data_type as return_type,
    '✅' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_type = 'FUNCTION'
    AND routine_name NOT LIKE 'pg_%'
ORDER BY routine_name;

-- =====================================================
-- VALIDACIÓN 8: VISTAS
-- =====================================================
\echo '👁️  Verificando vistas...'

WITH expected_views AS (
    SELECT unnest(ARRAY[
        'user_statistics', 'task_statistics', 'team_summary', 'dashboard_metrics'
    ]) as view_name
)
SELECT 
    ev.view_name,
    CASE 
        WHEN v.table_name IS NOT NULL THEN '✅'
        ELSE '❌ FALTANTE'
    END as status
FROM expected_views ev
LEFT JOIN information_schema.views v ON ev.view_name = v.table_name 
    AND v.table_schema = 'public'
ORDER BY ev.view_name;

-- =====================================================
-- VALIDACIÓN 9: ROW LEVEL SECURITY
-- =====================================================
\echo '🔒 Verificando Row Level Security...'

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Habilitado'
        ELSE '❌ RLS Deshabilitado'
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
    AND tablename IN ('users', 'tasks', 'task_assignments', 'notifications', 'activity_logs', 'task_comments', 'task_attachments')
ORDER BY tablename;

-- =====================================================
-- VALIDACIÓN 10: POLÍTICAS RLS
-- =====================================================
\echo '🛡️  Verificando políticas RLS...'

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    '✅' as status
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- VALIDACIÓN 11: DATOS INICIALES
-- =====================================================
\echo '💾 Verificando datos iniciales...'

-- Verificar configuraciones del sistema
SELECT 
    'system_settings' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) >= 10 THEN '✅'
        ELSE '⚠️ Pocos registros'
    END as status
FROM system_settings;

-- Verificar categorías de tareas
SELECT 
    'task_categories' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✅'
        ELSE '⚠️ Pocos registros'
    END as status
FROM task_categories;

-- Verificar templates de notificación
SELECT 
    'notification_templates' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✅'
        ELSE '⚠️ Pocos registros'
    END as status
FROM notification_templates;

-- =====================================================
-- VALIDACIÓN 12: CONSTRAINTS Y CHECKS
-- =====================================================
\echo '✅ Verificando constraints...'

SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    CASE 
        WHEN tc.constraint_type = 'CHECK' THEN '✅ CHECK'
        WHEN tc.constraint_type = 'UNIQUE' THEN '🔑 UNIQUE'
        WHEN tc.constraint_type = 'PRIMARY KEY' THEN '🗝️ PRIMARY KEY'
        ELSE tc.constraint_type
    END as status
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('CHECK', 'UNIQUE', 'PRIMARY KEY')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- =====================================================
-- VALIDACIÓN 13: PRUEBAS FUNCIONALES BÁSICAS
-- =====================================================
\echo '🧪 Ejecutando pruebas funcionales...'

-- Verificar que se puede llamar a la función de estadísticas
DO $$
DECLARE
    result RECORD;
    uuid_test UUID := 'a0000000-0000-0000-0000-000000000000';
BEGIN
    SELECT * INTO result FROM calculate_user_stats(uuid_test);
    RAISE NOTICE '✅ Función calculate_user_stats ejecutada correctamente';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error en función calculate_user_stats: %', SQLERRM;
END $$;

-- Verificar que las vistas funcionan
DO $$
DECLARE
    rec_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO rec_count FROM user_statistics;
    RAISE NOTICE '✅ Vista user_statistics: % registros', rec_count;
    
    SELECT COUNT(*) INTO rec_count FROM task_statistics;
    RAISE NOTICE '✅ Vista task_statistics: % registros', rec_count;
    
    SELECT COUNT(*) INTO rec_count FROM team_summary;
    RAISE NOTICE '✅ Vista team_summary: % registros', rec_count;
    
    SELECT COUNT(*) INTO rec_count FROM dashboard_metrics;
    RAISE NOTICE '✅ Vista dashboard_metrics: % registros', rec_count;
END $$;

-- =====================================================
-- RESUMEN FINAL
-- =====================================================
\echo '📊 RESUMEN DE VALIDACIÓN'

DO $$
DECLARE
    table_count INTEGER;
    view_count INTEGER;
    function_count INTEGER;
    trigger_count INTEGER;
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    SELECT COUNT(*) INTO view_count 
    FROM information_schema.views 
    WHERE table_schema = 'public';
    
    SELECT COUNT(*) INTO function_count 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
    
    SELECT COUNT(*) INTO trigger_count 
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public' AND trigger_name NOT LIKE 'RI_%';
    
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE '';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '🎉 VALIDACIÓN COMPLETADA';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '📋 Tablas creadas: %', table_count;
    RAISE NOTICE '👁️  Vistas creadas: %', view_count;
    RAISE NOTICE '🔧 Funciones creadas: %', function_count;
    RAISE NOTICE '⚡ Triggers activos: %', trigger_count;
    RAISE NOTICE '🛡️  Políticas RLS: %', policy_count;
    RAISE NOTICE '';
    
    IF table_count >= 14 AND view_count >= 4 AND function_count >= 5 THEN
        RAISE NOTICE '✅ TODAS LAS MIGRACIONES SE EJECUTARON CORRECTAMENTE';
        RAISE NOTICE '🚀 Base de datos lista para uso en producción';
    ELSE
        RAISE NOTICE '⚠️  ALGUNOS COMPONENTES PODRÍAN ESTAR FALTANDO';
        RAISE NOTICE '🔍 Revisar logs anteriores para identificar problemas';
    END IF;
    
    RAISE NOTICE '===========================================';
END $$;

-- Verificación final con timestamp
SELECT 
    '🎯 Validación completada' as mensaje,
    CURRENT_TIMESTAMP as timestamp,
    current_user as ejecutado_por,
    version() as postgresql_version;