using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;

namespace planilla_backend_asp.net.Handlers
{
  public class DeductionsHandler
  {
    private static SqlConnection connection;
    private string connectionRoute;
    public DeductionsHandler()
    {
      var builder = WebApplication.CreateBuilder();
      connectionRoute = builder.Configuration.GetConnectionString("EmpleadorContext");
      connection = new SqlConnection(connectionRoute);
    }

    private DataTable CreateTableConsult(SqlDataAdapter tableAdapter)
    {
      DataTable consultTable = new DataTable();
      connection.Open();
      tableAdapter.Fill(consultTable);
      connection.Close();

      return consultTable;
    }

    public bool CreateVoluntaryDeductions(VoluntaryDeductionsModel voluntaryDeduction)
    {
      var consult = @"INSERT INTO VoluntaryDeductions ([VoluntaryDeductionName], [ProjectName], [EmployerID], [Description],  [Cost], [isActive]) 
                      VALUES (@voluntaryDeductionName, @projectName, @employerID, @description, @cost, 0)";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of key attributes
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeduction.voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", voluntaryDeduction.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", voluntaryDeduction.employerID);

      // Insertion of optional attributes
      if (voluntaryDeduction.description != null && voluntaryDeduction.description != "")
      {
        queryCommand.Parameters.AddWithValue("@description", voluntaryDeduction.description);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@description", DBNull.Value);
      }
      if (voluntaryDeduction.cost != null && voluntaryDeduction.cost != "")
      {
        queryCommand.Parameters.AddWithValue("@cost", voluntaryDeduction.cost);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@cost", DBNull.Value);
      }

      connection.Open();
      bool status = queryCommand.ExecuteNonQuery() >= 1;
      connection.Close();

      return status;
    }

    public List<VoluntaryDeductionsModel> GetVoluntaryDeductionsData(string project, string employerID)
    {
      List<VoluntaryDeductionsModel> voluntaryDeductions = new List<VoluntaryDeductionsModel>();
      var consult = @"SELECT VoluntaryDeductionName, ProjectName, EmployerID, Description, Cost
                      FROM VoluntaryDeductions
                      WHERE ProjectName = @project AND EmployerID = @employerID AND IsActive = 0
                      ORDER BY VoluntaryDeductionName";
      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@project", project);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        voluntaryDeductions.Add(new VoluntaryDeductionsModel
        {
          voluntaryDeductionName = Convert.ToString(columna["VoluntaryDeductionName"]),
          projectName = Convert.ToString(columna["ProjectName"]),
          employerID = Convert.ToString(columna["EmployerID"]),
          description = Convert.ToString(columna["Description"]),
          cost = Convert.ToString(columna["Cost"])
        });
      }
      return voluntaryDeductions;
    }

    public List<MandatoryDeductionsModel> GetMandatoryDeductions()
    {
      List<MandatoryDeductionsModel> mandatoryDeductions = new List<MandatoryDeductionsModel>();
      string consult = @"SELECT * FROM MandatoryDeductions";
      SqlDataAdapter tableAdapter = new SqlDataAdapter(consult, connection);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        mandatoryDeductions.Add(new MandatoryDeductionsModel
        {
          Name = Convert.ToString(columna["MandatoryDeductionName"]),
          Percentage = Convert.ToDouble(columna["Percentage"]),
          Description = Convert.ToString(columna["Description"])
        });
      }
      return mandatoryDeductions;
    }

    public void UpdateVoluntaryDeductions(VoluntaryDeductionsModel voluntaryDeduction, string originalName)
    {
      string consult = "update VoluntaryDeductions [VoluntaryDeductionName] = @voluntaryDeductionName, set [Description] = @description, [Cost] = @cost where [VoluntaryDeductionName] = @originalName AND [projectName] = @projectName AND [employerID] = @employerID";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeduction.voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@originalName", originalName);
      queryCommand.Parameters.AddWithValue("@projectName", voluntaryDeduction.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", voluntaryDeduction.employerID);
      queryCommand.Parameters.AddWithValue("@description", voluntaryDeduction.description);
      queryCommand.Parameters.AddWithValue("@cost", voluntaryDeduction.cost);
      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public VoluntaryDeductionsModel GetSpecificVoluntaryDeductionInfo(string voluntaryDeductionName, string projectName, string employerID)
    {
      string consult = @"SELECT VoluntaryDeductionName, ProjectName, EmployerID, Description, Cost 
                      FROM VoluntaryDeductions
                      WHERE VoluntaryDeductionName = @voluntaryDeductionName and EmployerID = @employerID and ProjectName = @projectName";
      var voluntaryDeduction = new VoluntaryDeductionsModel();
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableFormatConsult = CreateTableConsult(tableAdapter);
      foreach (DataRow column in tableFormatConsult.Rows)
      {
        voluntaryDeduction.voluntaryDeductionName = Convert.ToString(column["VoluntaryDeductionName"]);
        voluntaryDeduction.projectName = Convert.ToString(column["ProjectName"]);
        voluntaryDeduction.employerID = Convert.ToString(column["EmployerID"]);
        voluntaryDeduction.description = Convert.ToString(column["Description"]);
        voluntaryDeduction.cost = Convert.ToString(column["cost"]);
      };

      return voluntaryDeduction;
    }

    public void DeleteVoluntaryDeduction(string voluntaryDeductionName, string projectName, string employerID)
    {
      // Prepare command to set voluntary deduction to inactive (1)
      string consult = "UPDATE VoluntaryDeductions SET [IsActive] = 1 WHERE [VoluntaryDeductionName] = @voluntaryDeductionName AND [ProjectName] = @projectName AND [EmployerID] = @employerID";

      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();

      // Prepare command to terminate a voluntary deduction requested by employees
      consult = "UPDATE VoluntaryDeductionsStatus SET [EndingDate] = @date WHERE [VoluntaryDeductionName] = @voluntaryDeductionName AND [ProjectName] = @projectName AND [EmployerID] = @employerID";

      queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@date", DateTime.Now.ToString("yyyy/MM/dd"));

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public List<VoluntaryDeductionsEmployeeModel> VoluntaryDeductionsBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      string consult = @"SELECT VoluntaryDeductions.VoluntaryDeductionName, VoluntaryDeductions.ProjectName, VoluntaryDeductions.EmployerID, Description, VoluntaryDeductionsStatus.Cost, StartDate, EndingDate
                      FROM VoluntaryDeductions 
                        JOIN VoluntaryDeductionsStatus ON VoluntaryDeductions.VoluntaryDeductionName = VoluntaryDeductionsStatus.VoluntaryDeductionName
                        AND VoluntaryDeductions.ProjectName = VoluntaryDeductionsStatus.ProjectName 
                        AND VoluntaryDeductions.EmployerID = VoluntaryDeductionsStatus.EmployerID
                      WHERE VoluntaryDeductions.ProjectName = @projectName
                        AND VoluntaryDeductions.EmployerID = @employerID
                        AND VoluntaryDeductionsStatus.EmployeeID = @employeeID
                        AND VoluntaryDeductions.IsActive = 0
                      ORDER BY VoluntaryDeductionName";

      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", employeeID);

      List<VoluntaryDeductionsEmployeeModel> voluntaryDeductions = new List<VoluntaryDeductionsEmployeeModel>();

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        voluntaryDeductions.Add(
          new VoluntaryDeductionsEmployeeModel
          {
            voluntaryDeductionName = reader["VoluntaryDeductionName"].ToString(),
            projectName = reader["ProjectName"].ToString(),
            employerID = reader["EmployerID"].ToString(),
            employeeID = employeeID,
            description = reader["Description"].ToString(),
            cost = reader["Cost"].ToString(),
            startDate = reader["StartDate"].ToString(),
            endingDate = reader["EndingDate"].ToString(),
          });
      }
      connection.Close();

      return voluntaryDeductions;
    }

    public List<VoluntaryDeductionsModel> VoluntaryDeductionsNotBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      string consult = @"SELECT VoluntaryDeductionName, ProjectName, EmployerID, Description, Cost
                      FROM VoluntaryDeductions
                      WHERE IsActive = 0
                      AND ProjectName = @projectName
					            AND EmployerID = @employerID
                      AND VoluntaryDeductionName NOT IN (
                        SELECT VoluntaryDeductionName
                        FROM VoluntaryDeductionsStatus
                        WHERE ProjectName = @projectName
                        AND EmployerID = @employerID
                        AND EmployeeID = @employeeID )
                      ORDER BY VoluntaryDeductionName";

      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", employeeID);

      List<VoluntaryDeductionsModel> voluntaryDeductions = new List<VoluntaryDeductionsModel>();

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        voluntaryDeductions.Add(
          new VoluntaryDeductionsModel
          {
            voluntaryDeductionName = reader["VoluntaryDeductionName"].ToString(),
            projectName = reader["ProjectName"].ToString(),
            employerID = reader["EmployerID"].ToString(),
            description = reader["Description"].ToString(),
            cost = reader["Cost"].ToString()
          });
      }
      connection.Close();

      return voluntaryDeductions;
    }

    public bool EstablishVoluntaryDeductionStatus(VoluntaryDeductionsEmployeeModel deduction)
    {
      var consult = @"INSERT INTO VoluntaryDeductionsStatus ([VoluntaryDeductionName], [ProjectName], [EmployerID], [EmployeeID], [StartDate], [Cost]) 
                      VALUES (@voluntaryDeductionName, @projectName, @employerID, @employeeID, @startDate, @cost)";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of key attributes
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", deduction.voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", deduction.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", deduction.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", deduction.employeeID);
      queryCommand.Parameters.AddWithValue("@startDate", DateTime.Now.ToString("yyyy/MM/dd"));
      queryCommand.Parameters.AddWithValue("@cost", deduction.cost);

      connection.Open();
      bool status = queryCommand.ExecuteNonQuery() >= 1;
      connection.Close();

      return status;
    }

    public void UpdateVoluntaryDeductionsEmployee(VoluntaryDeductionsEmployeeModel voluntaryDeduction)
    {
      string consult = "update VoluntaryDeductionsStatus set [Cost] = @cost where [VoluntaryDeductionName] = @voluntaryDeductionName AND [projectName] = @projectName AND [employerID] = @employerID";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeduction.voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", voluntaryDeduction.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", voluntaryDeduction.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", voluntaryDeduction.employeeID);
      queryCommand.Parameters.AddWithValue("@startDate", voluntaryDeduction.startDate);
      queryCommand.Parameters.AddWithValue("@endingDate", voluntaryDeduction.endingDate);
      queryCommand.Parameters.AddWithValue("@cost", voluntaryDeduction.cost);
      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public VoluntaryDeductionsEmployeeModel GetSpecificVoluntaryDeductionInfoEmployee(string voluntaryDeductionName, string projectName, string employerID)
    {
      string consult = @"SELECT VoluntaryDeductionName, ProjectName, EmployerID, EmployeeID, StartDate, EndingDate, Cost 
                      FROM VoluntaryDeductionsStatus
                      WHERE VoluntaryDeductionName = @voluntaryDeductionName and EmployerID = @employerID and ProjectName = @projectName";
      var voluntaryDeduction = new VoluntaryDeductionsEmployeeModel();
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@voluntaryDeductionName", voluntaryDeductionName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableFormatConsult = CreateTableConsult(tableAdapter);
      foreach (DataRow column in tableFormatConsult.Rows)
      {
        voluntaryDeduction.voluntaryDeductionName = Convert.ToString(column["VoluntaryDeductionName"]);
        voluntaryDeduction.projectName = Convert.ToString(column["ProjectName"]);
        voluntaryDeduction.employerID = Convert.ToString(column["EmployerID"]);
        voluntaryDeduction.employeeID = Convert.ToString(column["EmployeeID"]);
        voluntaryDeduction.startDate = Convert.ToString(column["StartDate"]);
        voluntaryDeduction.endingDate = Convert.ToString(column["EndingDate"]);
        voluntaryDeduction.cost = Convert.ToString(column["cost"]);
      };
      return voluntaryDeduction;
    }

  }
}
