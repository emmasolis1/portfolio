using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Models;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class DeductionsController : ControllerBase
  {

    [HttpGet]
    [Route("voluntaryDeductions")]
    public ActionResult GetVoluntaryDeductions(string projectName, string employerID)
    {
      var handler = new DeductionsHandler();
      var data = handler.GetVoluntaryDeductionsData(projectName, employerID);
      return Ok(data);
    }

    [HttpPost]
    [Route("voluntaryDeductions")]
    public ActionResult CreateVoluntaryDeduction([FromBody] VoluntaryDeductionsModel voluntaryDeductions)
    {
      DeductionsHandler handler = new DeductionsHandler();
      handler.CreateVoluntaryDeductions(voluntaryDeductions);
      return Ok();
    }

    [HttpGet]
    [Route("mandatoryDeductions")]
    public ActionResult GetObligatoryDeductions()
    {
      var handler = new DeductionsHandler();
      var data = handler.GetMandatoryDeductions();
      return Ok(data);
    }

    [HttpGet]
    [Route("specificVoluntaryDeduction")]
    public ActionResult UpdateVoluntaryDeduction(string voluntaryDeductionName, string projectName, string employerID)
    {
      try
      {
        DeductionsHandler handler = new DeductionsHandler();
        var data = handler.GetSpecificVoluntaryDeductionInfo(voluntaryDeductionName, projectName, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPut]
    [Route("specificVoluntaryDeduction")]
    public ActionResult UpdateVoluntaryDeductions([FromBody] VoluntaryDeductionsModel voluntaryDeductions, string originalName)
    {
      try
      {
        DeductionsHandler handler = new DeductionsHandler();
        handler.UpdateVoluntaryDeductions(voluntaryDeductions, originalName);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpDelete]
    [Route("deleteVoluntaryDeduction/")]
    public ActionResult DeleteVoluntaryDeduction([FromQuery] string voluntaryDeductionName, string projectName, string employerID)
    {
      try
      {
        DeductionsHandler handler = new DeductionsHandler();
        handler.DeleteVoluntaryDeduction(voluntaryDeductionName, projectName, employerID);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("voluntaryDeductionsBeingUsedByEmployee")]
    public ActionResult VoluntaryDeductionsBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      try
      {
        var handler = new DeductionsHandler();
        var data = handler.VoluntaryDeductionsBeingUsedByEmployee(projectName, employerID, employeeID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("voluntaryDeductionsNotBeingUsedByEmployee")]
    public ActionResult VoluntaryDeductionsNotBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      try
      {
        var handler = new DeductionsHandler();
        var data = handler.VoluntaryDeductionsNotBeingUsedByEmployee(projectName, employerID, employeeID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPost]
    [Route("requestVoluntaryDeduction")]
    public ActionResult EstablishVoluntaryDeductionStatus([FromBody] VoluntaryDeductionsEmployeeModel deduction)
    {
      try
      {
        DeductionsHandler handler = new DeductionsHandler();
        handler.EstablishVoluntaryDeductionStatus(deduction);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("specificVoluntaryDeductionEmployee")]
    public ActionResult UpdateVoluntaryDeductionEmployee(string voluntaryDeductionName, string projectName, string employerID)
    {
      try
      {
        DeductionsHandler handler = new DeductionsHandler();
        var data = handler.GetSpecificVoluntaryDeductionInfoEmployee(voluntaryDeductionName, projectName, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPut]
    [Route("specificVoluntaryDeductionEmployee")]
    public ActionResult UpdateVoluntaryDeductionsEmployee([FromBody] VoluntaryDeductionsEmployeeModel voluntaryDeductions)
    {
      try
      {
        DeductionsHandler handler = new DeductionsHandler();
        handler.UpdateVoluntaryDeductionsEmployee(voluntaryDeductions);
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
