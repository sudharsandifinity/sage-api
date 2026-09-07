CREATE OR ALTER PROCEDURE dbo.usp_GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;

    SELECT u.id, u.name, u.email, u.status
    FROM dbo.users AS u
    ORDER BY u.name;
END
