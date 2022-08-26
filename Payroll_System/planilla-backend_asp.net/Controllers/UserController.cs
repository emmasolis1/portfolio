using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Models;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class UserController : ControllerBase
  {
    [HttpGet]
    [Route("employees")]
    public ActionResult GetEmployees()
    {
      // Get data from database
      UserHandler handler = new UserHandler();
      var data = handler.GetAllEmployeesSummarized();
      return Ok(data);
    }

    [HttpGet]
    [Route("getUserData")]
    public ActionResult GetUserData(string email, string password)
    {
      var handler = new UserHandler();
      var data = handler.GetUserData(email, password);
      return Ok(data);
    }

    [HttpGet]
    [Route("specificProjectEmployees")]
    public ActionResult GetSpecificProjectEmployees(string projectName, string employerID)
    {
      var handler = new UserHandler();
      var data = handler.GetSpecificProjectEmployees(projectName, employerID);
      return Ok(data);
    }

    [HttpGet]
    [Route("employeesNotInProject")]
    public ActionResult GetEmployeesNotInProject(string projectName, string employerID)
    {
      var handler = new UserHandler();
      var data = handler.GetEmployeesNotInProject(projectName, employerID);
      return Ok(data);
    }

    [HttpGet]
    [Route("specificContract")]
    public ActionResult GetSpecificContract(string projectName, string employerID, string employeeID)
    {
      var handler = new UserHandler();
      var data = handler.GetSpecificContract(projectName, employerID, employeeID);
      return Ok(data);
    }

    [HttpGet]
    [Route("getHours")]
    public ActionResult GetHours(string projectName, string employerID)
    {
      try
      {
        UserHandler handler = new UserHandler();
        var data = handler.GetHours(projectName, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPost]
    [Route("employees")]
    public ActionResult CreateEmployee([FromBody] UserModel employee)
    {
      // Create new employee
      UserHandler handler = new UserHandler();
      handler.CreateEmployee(employee);
      return Ok();
    }

    [HttpPost]
    [Route("register")]
    public ActionResult CreateEmployer([FromBody] UserModel employer)
    {
      try
      {
        UserHandler handler = new UserHandler();
        handler.CreateEmployer(employer);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPost]
    [Route("addEmployeeToProject")]
    public ActionResult AddEmployeeToProject([FromBody] ContractModel contract)
    {
      // Save new contract
      UserHandler handler = new UserHandler();
      handler.AddEmployeeToProject(contract);
      return Ok();
    }

    [HttpPost]
    [Route("account")]
    public ActionResult EditEmployeeProfile([FromBody] ReciberModel id)
    {
      try
      {
        UserHandler handler = new UserHandler();
        var data = handler.GetEmployeeInfo(id);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPost]
    [Route("hourRegistration")]
    public ActionResult RegisterHours([FromBody] HourRegistrationModel hours)
    {
      UserHandler handler = new UserHandler();
      handler.RegisterHours(hours);
      return Ok();
    }

    [HttpPut]
    [Route("manageHours")]
    public ActionResult ManageHours([FromBody] HourRegistrationModel hours)
    {
      try
      {
        UserHandler handler = new UserHandler();
        handler.ManageHours(hours);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPut]
    [Route("account")]
    public ActionResult EditEmployeeProfile([FromBody] UserEmployeeInfoToModify employee)
    {
      try
      {
        UserHandler handler = new UserHandler();
        handler.UpdateEmployeeInfo(employee);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpDelete]
    [Route("deleteEmployee/")]
    public ActionResult DeleteEmployee([FromQuery] string id)
    {
      try
      {
        UserHandler handler = new UserHandler();
        handler.DeleteEmployee(id);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("viewEmployee/")]
    public ActionResult ViewEmployee([FromQuery] string id)
    {
      try
      {
        UserHandler handler = new UserHandler();
        var data = handler.ViewEmployeeInfo(id);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpDelete]
    [Route("deleteEmployeeFromProject/")]
    public ActionResult DeleteEmployeeFromProject([FromQuery] string projectName, string id)
    {
      try
      {
        UserHandler handler = new UserHandler();
        handler.DeleteEmployeeFromProject(projectName, id);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }
  }
}
