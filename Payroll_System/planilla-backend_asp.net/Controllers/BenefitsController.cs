using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Models;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class BenefitsController : ControllerBase
  {
    [HttpGet]
    [Route("benefits")]
    public ActionResult GetBenefits(string projectName, string employerID)
    {
      try
      {
        var handler = new BenefitsHandler();
        var data = handler.GetBenefitsData(projectName, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("benefitsBeingUsedByEmployee")]
    public ActionResult BenefitsBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      try
      {
        var handler = new BenefitsHandler();
        var data = handler.BenefitsBeingUsedByEmployee(projectName, employerID, employeeID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("benefitsNotBeingUsedByEmployee")]
    public ActionResult BenefitsNotBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      try
      {
        var handler = new BenefitsHandler();
        var data = handler.BenefitsNotBeingUsedByEmployee(projectName, employerID, employeeID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPost]
    [Route("benefits")]
    public ActionResult CreateBenefit([FromBody] BenefitsModel benefit)
    {
      try
      {
        // Create new benefit
        BenefitsHandler handler = new BenefitsHandler();
        handler.CreateBenefit(benefit);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("specificBenefit")]
    public ActionResult EditBenefit(string benefitName, string projectName, string employerID)
    {
      try
      {
        BenefitsHandler handler = new BenefitsHandler();
        var data = handler.GetSpecificBenefitInfo(benefitName, projectName, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPut]
    [Route("specificBenefit")]
    public ActionResult EditBenefit([FromBody] BenefitsModel benefit)
    {
      try
      {
        BenefitsHandler handler = new BenefitsHandler();
        handler.UpdateBenefitInfo(benefit);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpDelete]
    [Route("deleteBenefit/")]
    public ActionResult DeleteBenefit([FromQuery] string benefitName, string projectName, string employerID)
    {
      try
      {
        BenefitsHandler handler = new BenefitsHandler();
        handler.DeleteBenefit(benefitName, projectName, employerID);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPost]
    [Route("requestBenefit")]
    public ActionResult EstablishBenefitStatus([FromBody] BenefitEmployeeModel benefit)
    {
      try
      {
        // Request a benefit
        BenefitsHandler handler = new BenefitsHandler();
        handler.EstablishBenefitStatus(benefit);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPut]
    [Route("unsubscribeBenefit")]
    public ActionResult RelinquishBenefitStatus([FromBody] BenefitEmployeeModel benefit)
    {
      try
      {
        BenefitsHandler handler = new BenefitsHandler();
        handler.RelinquishBenefitStatus(benefit);
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
