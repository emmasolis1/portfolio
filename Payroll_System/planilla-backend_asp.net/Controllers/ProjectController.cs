using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Models;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class ProjectController : ControllerBase
  {
    [HttpGet]
    [Route("projects")]
    public ActionResult GetProjects(string employerID)
    {
      var handler = new ProjectHandler();
      var data = handler.GetProyectsData(employerID);
      return Ok(data);
    }

    [HttpGet]
    [Route("projectsEmployeeSide")]
    public ActionResult GetProjectsEmployeeSide(string employeeID)
    {
      var handler = new ProjectHandler();
      var data = handler.GetProjectsEmployeeSide(employeeID);
      return Ok(data);
    }

    [HttpPost]
    [Route("projects")]
    public ActionResult CreateProject([FromBody] ProjectModel project)
    {
      // Create new project
      ProjectHandler handler = new ProjectHandler();
      handler.CreateProject(project);
      return Ok();
    }

    [HttpGet]
    [Route("specificProject")]
    public ActionResult EditProject(string project, string employerID)
    {
      try
      {
        ProjectHandler handler = new ProjectHandler();
        var data = handler.GetSpecificProjectInfo(project, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpGet]
    [Route("getLastPayment")]
    public ActionResult GetLastPayment(string projectName, string employerID)
    {
      try
      {
        ProjectHandler handler = new ProjectHandler();
        var data = handler.GetLastPayment(projectName, employerID);
        return Ok(data);
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpPut]
    [Route("specificProject")]
    public ActionResult EditProject([FromBody] ProjectModel project)
    {
      try
      {
        ProjectHandler handler = new ProjectHandler();
        handler.UpdateProjectInfo(project);
        return Ok();
      }
      catch (Exception error)
      {
        Console.WriteLine(error);
        return BadRequest(error.Message);
      }
    }

    [HttpDelete]
    [Route("deleteProject/")]
    public ActionResult DeleteProject([FromQuery] string projectName, string employerID)
    {
      try
      {
        ProjectHandler handler = new ProjectHandler();
        handler.DeleteProject(projectName, employerID);
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
