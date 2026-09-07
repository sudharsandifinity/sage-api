CREATE OR ALTER PROCEDURE dbo.usp_CreateUser
    @Name   VARCHAR(50),
    @Email  VARCHAR(50),
    @Status VARCHAR(20) = 'active',
    @Id     INT = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.users WHERE email = @Email)
        THROW 50001, 'A user with this email already exists.', 1;

    INSERT INTO dbo.users (name, email, status)
    VALUES (@Name, @Email, @Status);

    SET @Id = CAST(SCOPE_IDENTITY() AS INT);

    SELECT u.id, u.name, u.email, u.status
    FROM dbo.users AS u
    WHERE u.id = @Id;
END
