IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.users') AND name = 'id'
)
BEGIN
    ALTER TABLE dbo.users
        ADD id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_users PRIMARY KEY;
END

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.users')
      AND name = 'status'
      AND system_type_id = TYPE_ID('varbinary')
)
BEGIN
    ALTER TABLE dbo.users ALTER COLUMN status VARCHAR(20) NULL;
END

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE object_id = OBJECT_ID('dbo.users') AND name = 'UX_users_email'
)
BEGIN
    CREATE UNIQUE INDEX UX_users_email
        ON dbo.users (email)
        WHERE email IS NOT NULL;
END
