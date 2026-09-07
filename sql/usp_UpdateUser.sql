CREATE OR ALTER PROCEDURE dbo.usp_UpdateUser
    @Id     INT,
    @Name   VARCHAR(50) = NULL,
    @Email  VARCHAR(50) = NULL,
    @Status VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE id = @Id)
    BEGIN
        SELECT TOP (0) u.id, u.name, u.email, u.status FROM dbo.users AS u;
        RETURN;
    END

    IF @Email IS NOT NULL AND EXISTS (SELECT 1 FROM dbo.users WHERE email = @Email AND id <> @Id)
        THROW 50001, 'A user with this email already exists.', 1;

    UPDATE dbo.users
    SET name   = COALESCE(@Name, name),
        email  = COALESCE(@Email, email),
        status = COALESCE(@Status, status)
    WHERE id = @Id;

    SELECT u.id, u.name, u.email, u.status
    FROM dbo.users AS u
    WHERE u.id = @Id;
END
