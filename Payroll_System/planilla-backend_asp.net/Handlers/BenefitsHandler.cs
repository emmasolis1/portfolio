using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;

namespace planilla_backend_asp.net.Handlers
{
  public class BenefitsHandler
  {
    private static SqlConnection connection;
    private string connectionRoute;
    public BenefitsHandler()
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

    public List<BenefitsModel> GetBenefitsData(string projectName, string employerID)
    {
      List<BenefitsModel> benefits = new List<BenefitsModel>();
      var consult = @"SELECT BenefitName, ProjectName, EmployerID, Description, Cost
                      FROM Benefits
                      WHERE ProjectName = @projectName AND EmployerID = @employerID AND IsActive = 0
                      ORDER BY BenefitName";
      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tablaResultado = CreateTableConsult(tableAdapter);
      foreach (DataRow columna in tablaResultado.Rows)
      {
        benefits.Add(new BenefitsModel
        {
          benefitName = Convert.ToString(columna["BenefitName"]),
          projectName = Convert.ToString(columna["ProjectName"]),
          employerID = Convert.ToString(columna["EmployerID"]),
          description = Convert.ToString(columna["Description"]),
          cost = Convert.ToString(columna["Cost"]),
        });
      }

      return benefits;
    }

    public bool CreateBenefit(BenefitsModel benefit)
    {
      var consult = @"INSERT INTO Benefits ([BenefitName], [ProjectName], [EmployerID], [Description], [Cost], [IsActive]) 
                      VALUES (@benefitName, @projectName, @employerID, @description, @cost, 0)";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of key attributes
      queryCommand.Parameters.AddWithValue("@benefitName", benefit.benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", benefit.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", benefit.employerID);

      // Insertion of optional attributes
      if (benefit.description != null && benefit.description != "")
      {
        queryCommand.Parameters.AddWithValue("@description", benefit.description);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@description", DBNull.Value);
      }

      if (benefit.cost != null && benefit.cost != "")
      {
        queryCommand.Parameters.AddWithValue("@cost", benefit.cost);
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

    public void UpdateBenefitInfo(BenefitsModel info)
    {
      // Prepare command
      string consult = "update Benefits set [Description] = @description, [Cost] = @cost where [BenefitName] = @benefitName AND [ProjectName] = @projectName and [EmployerID] = @employerID";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@benefitName", info.benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", info.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", info.employerID);
      queryCommand.Parameters.AddWithValue("@description", info.description);
      queryCommand.Parameters.AddWithValue("@cost", info.cost);
      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public BenefitsModel GetSpecificBenefitInfo(string benefitName, string projectName, string employerID)
    {
      string consult = @"SELECT BenefitName, ProjectName, EmployerID, Description, Cost
                      FROM Benefits
                      WHERE BenefitName = @benefitName and EmployerID = @employerID and ProjectName = @projectName";
      var benefit = new BenefitsModel();
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@benefitName", benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableFormatConsult = CreateTableConsult(tableAdapter);
      foreach (DataRow column in tableFormatConsult.Rows)
      {
        benefit.benefitName = Convert.ToString(column["benefitName"]);
        benefit.projectName = Convert.ToString(column["ProjectName"]);
        benefit.employerID = Convert.ToString(column["EmployerID"]);
        benefit.description = Convert.ToString(column["Description"]);
        benefit.cost = Convert.ToString(column["cost"]);
      };
      return benefit;
    }

    public void DeleteBenefit(string benefitName, string projectName, string employerID)
    {
      // Prepare command to set benefit to inactive (1)
      string consult = "UPDATE Benefits SET [IsActive] = 1 WHERE [BenefitName] = @benefitName AND [ProjectName] = @projectName AND [EmployerID] = @employerID";

      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@benefitName", benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();

      // Prepare command to terminate a benefit requested by employees
      consult = "UPDATE BenefitsStatus SET [EndDate] = @date WHERE [BenefitName] = @benefitName AND [ProjectName] = @projectName AND [EmployerID] = @employerID";

      queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@benefitName", benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@date", DateTime.Now.ToString("yyyy/MM/dd"));

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public List<BenefitEmployeeModel> BenefitsBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      string consult = @"SELECT Benefits.BenefitName, Benefits.ProjectName, Benefits.EmployerID, Description, Cost, StartDate, EndDate
                      FROM Benefits 
                        JOIN BenefitsStatus ON Benefits.BenefitName = BenefitsStatus.BenefitName
                        AND Benefits.ProjectName = BenefitsStatus.ProjectName 
                        AND Benefits.EmployerID = BenefitsStatus.EmployerID
                      WHERE Benefits.ProjectName = @projectName
                        AND Benefits.EmployerID = @employerID
                        AND BenefitsStatus.EmployeeID = @employeeID
                        AND Benefits.IsActive = 0
                      ORDER BY EndDate, BenefitName";

      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", employeeID);

      List<BenefitEmployeeModel> benefits = new List<BenefitEmployeeModel>();

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        benefits.Add(
          new BenefitEmployeeModel
          {
            benefitName = reader["BenefitName"].ToString(),
            projectName = reader["ProjectName"].ToString(),
            employerID = reader["EmployerID"].ToString(),
            employeeID = employeeID,
            description = reader["Description"].ToString(),
            cost = reader["Cost"].ToString(),
            startDate = reader["StartDate"].ToString(),
            endDate = reader["EndDate"].ToString(),
          });
      }
      connection.Close();

      return benefits;
    }

    public List<BenefitsModel> BenefitsNotBeingUsedByEmployee(string projectName, string employerID, string employeeID)
    {
      string consult = @"SELECT BenefitName, ProjectName, EmployerID, Description, Cost
                      FROM Benefits
                      WHERE IsActive = 0
                      AND ProjectName = @projectName
					            AND EmployerID = @employerID
                      AND BenefitName NOT IN (
                        SELECT BenefitName
                        FROM BenefitsStatus
                        WHERE ProjectName = @projectName
                        AND EmployerID = @employerID
                        AND EmployeeID = @employeeID
                        AND EndDate IS NULL)
                      ORDER BY BenefitName";

      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", employeeID);

      List<BenefitsModel> benefits = new List<BenefitsModel>();

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        benefits.Add(
          new BenefitsModel
          {
            benefitName = reader["BenefitName"].ToString(),
            projectName = reader["ProjectName"].ToString(),
            employerID = reader["EmployerID"].ToString(),
            description = reader["Description"].ToString(),
            cost = reader["Cost"].ToString()
          });
      }
      connection.Close();

      return benefits;
    }

    public bool EstablishBenefitStatus(BenefitEmployeeModel benefit)
    {
      var consult = @"INSERT INTO BenefitsStatus ([BenefitName], [ProjectName], [EmployerID], [EmployeeID], [StartDate]) 
                      VALUES (@benefitName, @projectName, @employerID, @employeeID, @startDate)";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of key attributes
      queryCommand.Parameters.AddWithValue("@benefitName", benefit.benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", benefit.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", benefit.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", benefit.employeeID);
      queryCommand.Parameters.AddWithValue("@startDate", DateTime.Now.ToString("yyyy/MM/dd"));

      connection.Open();
      bool status = queryCommand.ExecuteNonQuery() >= 1;
      connection.Close();

      return status;
    }

    public bool RelinquishBenefitStatus(BenefitEmployeeModel benefit)
    {
      var consult = @"UPDATE BenefitsStatus SET [EndDate] = @date
                    WHERE [BenefitName] = @benefitName 
                    AND [ProjectName] = @projectName 
                    AND [EmployerID] = @employerID
                    AND [EmployeeID] = @employeeID
                    AND [StartDate] = @startDate";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of key attributes
      queryCommand.Parameters.AddWithValue("@benefitName", benefit.benefitName);
      queryCommand.Parameters.AddWithValue("@projectName", benefit.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", benefit.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", benefit.employeeID);
      queryCommand.Parameters.AddWithValue("@startDate", benefit.startDate);
      queryCommand.Parameters.AddWithValue("@date", DateTime.Now.ToString("yyyy/MM/dd"));

      connection.Open();
      bool status = queryCommand.ExecuteNonQuery() >= 1;
      connection.Close();

      return status;
    }
  }
}
