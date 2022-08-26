using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;

namespace planilla_backend_asp.net.Handlers
{ 
    public class PaymentHistoryHandler
    {
        private static SqlConnection connection;
        private string connectionRoute;
        public PaymentHistoryHandler()
        {
            var builder = WebApplication.CreateBuilder();
            connectionRoute = builder.Configuration.GetConnectionString("EmpleadorContext");
            connection = new SqlConnection(connectionRoute);
        }
        private DataTable CreateTableConsult(SqlCommand queryCommand)
        {
            SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
            DataTable tableFormatQuery = new DataTable();
            connection.Open();
            tableAdapter.Fill(tableFormatQuery);
            connection.Close();
            return tableFormatQuery;
        }
        private DataTable GetAllPayments(string employeeId)
        {
            var consult = "EXECUTE GetAllEmployeePayments @employee_id";
            var queryCommand = new SqlCommand(consult, connection);
            queryCommand.Parameters.AddWithValue("@employee_id", employeeId);
            return CreateTableConsult(queryCommand);
        }
        private DataTable GetVoluntaryDeductions(PaymentHistoryModel payment)
        {
            var consult = "EXECUTE GetVoluntaryDeductionsFromPayment @project_name, @employer_id, @employee_id, @contract_date, @payment_date";
            var queryCommand = new SqlCommand(consult, connection);
            queryCommand.Parameters.AddWithValue("@project_name", payment.projectName);
            queryCommand.Parameters.AddWithValue("@employer_id", payment.employerId);
            queryCommand.Parameters.AddWithValue("@employee_id", payment.employeeId);
            queryCommand.Parameters.AddWithValue("@contract_date", payment.contractDate);
            queryCommand.Parameters.AddWithValue("@payment_date", payment.paymentDate);
            return CreateTableConsult(queryCommand);
        }
        private DataTable GetMandatoryDeductions(PaymentHistoryModel payment)
        {
            var consult = "EXECUTE GetMandatoryDeductionsFromPayment @project_name, @employer_id, @employee_id, @contract_date, @payment_date, @payment";
            var queryCommand = new SqlCommand(consult, connection);
            queryCommand.Parameters.AddWithValue("@project_name", payment.projectName);
            queryCommand.Parameters.AddWithValue("@employer_id", payment.employerId);
            queryCommand.Parameters.AddWithValue("@employee_id", payment.employeeId);
            queryCommand.Parameters.AddWithValue("@contract_date", payment.contractDate);
            queryCommand.Parameters.AddWithValue("@payment_date", payment.paymentDate);
            queryCommand.Parameters.AddWithValue("@payment", payment.netSalary);
            return CreateTableConsult(queryCommand);
        }
        public List<PaymentHistoryModel> GetPaymentHistory(string employeeId)
        {
            DataTable resultTable = GetAllPayments(employeeId);
            List<PaymentHistoryModel> payments = new List<PaymentHistoryModel>();
            foreach (DataRow column in resultTable.Rows)
            {
                PaymentHistoryModel historyPayment = new PaymentHistoryModel
                {
                    projectName = Convert.ToString(column["ProjectName"]),
                    employerId = Convert.ToString(column["EmployerID"]),
                    employeeId = Convert.ToString(column["EmployeeID"]),
                    contractDate = Convert.ToString(column["StartDate"]),
                    contractType = Convert.ToString(column["ContractType"]),
                    paymentDate = Convert.ToString(column["PaymentDate"]),
                    netSalary = Convert.ToDouble(column["NetSalary"]),
                };
                double totalDeductions = 0;
                // get voluntary deductions
                DataTable volutaryDeductions = GetVoluntaryDeductions(historyPayment);
                foreach (DataRow vDeduction in volutaryDeductions.Rows)
                {
                    VoluntaryDeductionHistoryModel voluntaryDeduction = new VoluntaryDeductionHistoryModel
                    {
                        name = Convert.ToString(vDeduction["VoluntaryDeductionName"]),
                        paymentDeduction = Convert.ToDouble(vDeduction["Cost"])
                    };
                    historyPayment.voluntaryDeductions.Add(voluntaryDeduction);
                    totalDeductions += voluntaryDeduction.paymentDeduction;
                }
                // get mandatory deductions
                DataTable mandatoryDeductions = GetMandatoryDeductions(historyPayment);
                foreach (DataRow mDeduction in mandatoryDeductions.Rows)
                {
                    // calculate total amount deducted
                    double deductionFromPayment = 0;
                    string condition = Convert.ToString(mDeduction["Condition"]);
                    if (condition != "0" && condition != "1")
                    {
                        deductionFromPayment = Convert.ToDouble(mDeduction["IncomeDeductionAmount"]);
                    }
                    else if (condition != "1")
                    {
                        double percentage = Convert.ToDouble(mDeduction["Percentage"]);
                        deductionFromPayment = historyPayment.netSalary * (percentage / 100);
                    }
                    // saves the info in the model
                    MandatoryDeductionHistoryModel mandatoryDeduction = new MandatoryDeductionHistoryModel
                    {
                        name = Convert.ToString(mDeduction["MandatoryDeductionName"]),
                        paymentDeduction = deductionFromPayment
                    };
                    historyPayment.mandatoryDeductions.Add(mandatoryDeduction);
                    totalDeductions += mandatoryDeduction.paymentDeduction;
                }
                // calculate payment
                historyPayment.payment = historyPayment.netSalary - totalDeductions;
                payments.Add(historyPayment);
            }
            return payments;
        }
    }

}
