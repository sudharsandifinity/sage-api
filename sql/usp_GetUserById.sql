CREATE OR ALTER PROCEDURE dbo.usp_GetUserById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT u.id, u.name, u.email, u.status
    FROM dbo.users AS u
    WHERE u.id = @Id;
END
