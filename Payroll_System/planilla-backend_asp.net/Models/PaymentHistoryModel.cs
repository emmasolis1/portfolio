namespace planilla_backend_asp.net.Models
{
	public class PaymentHistoryModel
	{
		public PaymentHistoryModel()
		{
			mandatoryDeductions = new List<MandatoryDeductionHistoryModel>();
			voluntaryDeductions = new List<VoluntaryDeductionHistoryModel>();
		}
		public string projectName { get; set; }
		public string employerId { get; set; }
		public string employeeId { get; set; }
		public string contractDate { get; set; }
		public string contractType { get; set; }
		public string paymentDate { get; set; }
		public double netSalary { get; set; }
		public ICollection<MandatoryDeductionHistoryModel> mandatoryDeductions { get; set; }
		public ICollection<VoluntaryDeductionHistoryModel> voluntaryDeductions { get; set; }
		public double payment { get; set; } = 0;
	}
	public class MandatoryDeductionHistoryModel
    {
		public string name { get; set; }
		public double paymentDeduction { get; set; }
	}
	public class VoluntaryDeductionHistoryModel
	{
		public string name { get; set; }
		public double paymentDeduction { get; set; }
	}
}
