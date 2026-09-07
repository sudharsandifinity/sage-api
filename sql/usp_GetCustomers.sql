CREATE OR ALTER PROCEDURE dbo.usp_GetCustomers
    @Search     NVARCHAR(100) = NULL,
    @Page       INT           = 1,
    @PageSize   INT           = 50,
    @TotalCount INT           = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    IF @Page < 1 OR @PageSize < 1
        THROW 50001, 'Page and PageSize must be greater than zero.', 1;

    SELECT @TotalCount = COUNT(1)
    FROM dbo.Customers AS c
    WHERE (@Search IS NULL OR c.CustomerName LIKE '%' + @Search + '%');

    SELECT
        c.CustomerId,
        c.CustomerName,
        c.City,
        c.Country,
        c.Balance,
        c.IsActive
    FROM dbo.Customers AS c
    WHERE (@Search IS NULL OR c.CustomerName LIKE '%' + @Search + '%')
    ORDER BY c.CustomerName
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO
