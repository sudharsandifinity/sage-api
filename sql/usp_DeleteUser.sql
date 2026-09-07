CREATE OR ALTER PROCEDURE dbo.usp_DeleteUser
    @Id          INT,
    @RowsDeleted INT = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.users WHERE id = @Id;

    SET @RowsDeleted = @@ROWCOUNT;
END
