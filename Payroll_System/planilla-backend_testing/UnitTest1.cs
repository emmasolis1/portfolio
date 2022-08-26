using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using planilla_backend_asp.net.Controllers;

namespace planilla_backend_testing
{
  public class Tests
  {
    [SetUp]
    public void Setup()
    {
    }

    // ---------------- Dashboard Controller ----------------
    [Test]
    public void GetDashboardTest()
    {
      // Arrange
      DashboardController controller = new DashboardController();

      // Act
      IActionResult result = controller.GetDashboard("0123456789");

      // Assert
      Assert.IsNotNull(result);
    }

    [Test]
    public void GetDashboardEmployeeTest()
    {
      // Arrange
      DashboardController controller = new DashboardController();

      // Act
      IActionResult result = controller.GetDashboardEmployee("0123456789");

      // Assert
      Assert.IsNotNull(result);
    }

    // ---------------- Deductions Controller ----------------
    // A [Test] method that tests the VoluntaryDeductionsBeignUsedByEmployee method of the DeductionsController class.
    [Test]
    public void VoluntaryDeductionsBeignUsedByEmployeeTest()
    {
      // Arrange
      DeductionsController controller = new DeductionsController();

      // Act
      IActionResult result = controller.VoluntaryDeductionsBeingUsedByEmployee("Test", "0123456789", "0987654321");

      // Assert
      Assert.IsNotNull(result);
    }

    // A [Test] method that tests the VoluntaryDeductionsNotBeignUsedByEmployee method of the DeductionsController class.
    [Test]
    public void VoluntaryDeductionsNotBeignUsedByEmployeeTest()
    {
      // Arrange
      DeductionsController controller = new DeductionsController();

      // Act
      IActionResult result = controller.VoluntaryDeductionsNotBeingUsedByEmployee("Test", "0123456789", "0987654321");

      // Assert
      Assert.IsNotNull(result);
    }

    // A [Test] method that tests the EstablishVoluntaryDeductionStatus method of the DeductionsController class.
    
    [Test]
    public void EstablishVoluntaryDeductionStatusTest()
    {
      // Arrange
      DeductionsController controller = new DeductionsController();

      // Act
      IActionResult result = controller.EstablishVoluntaryDeductionStatus(new planilla_backend_asp.net.Models.VoluntaryDeductionsEmployeeModel());

      // Assert
      Assert.IsNotNull(result);
    }

    // A [Test] method that tests the UpdateVoluntaryDeductionEmployee method of the DeductionsController class using mock data.
    [Test]
    public void UpdateVoluntaryDeductionEmployeeTest()
    {
      // Arrange
      DeductionsController controller = new DeductionsController();

      // Act
      IActionResult result = controller.UpdateVoluntaryDeductionEmployee("Test", "Test", "0123456789");

      // Assert
      Assert.IsNotNull(result);
    }

    // ---------------- Payment Controller ----------------
    // A [Test] method that tests the GetEmployeePaymentHistory method of the PaymentController class using mock data.
    [Test]
    public void GetEmployeePaymentHistoryTest()
    {
      // Arrange
      PaymentController controller = new PaymentController();

      // Act
      IActionResult result = controller.GetEmployeePaymentsHistory("Test", "0123456789");

      // Assert
      Assert.IsNotNull(result);
    }

    // ---------------- Project Controller ----------------
    // A [Test] method that tests the GetProjects method of the ProjectController class using mock data.
    [Test]
    public void GetProjectsTest()
    {
      // Arrange
      ProjectController controller = new ProjectController();

      // Act
      IActionResult result = controller.GetProjects("0123456789");

      // Assert
      Assert.IsNotNull(result);
    }

    // ---------------- Report Controller ----------------
    // A [Test] method that tests the GetProjects method of the ReportController class using mock data.
    [Test]
    public void GetProjectsEmployeeSideTest()
    {
      // Arrange
      ReportsController controller = new ReportsController();

      // Act
      IActionResult result = controller.GetProjects("0123456789");

      // Assert
      Assert.IsNotNull(result);
    }

    // ---------------- User Controller ----------------
    [Test]
    public void GetUserDataTest()
    {
      // Arrange
      UserController controller = new UserController();

      // Act
      IActionResult result = controller.GetUserData("daniel.arias@gmail.com", "daniel");

      // Assert
      Assert.IsNotNull(result);
    }

    // A [Test] method that tests the ManageHours method of the UserController class using mock data.
    [Test]
    public void ManageHoursTest()
    {
      // Arrange
      UserController controller = new UserController();

      // Act
      IActionResult result = controller.ManageHours(new planilla_backend_asp.net.Models.HourRegistrationModel());

      // Assert
      Assert.IsNotNull(result);
    }
  }
}
