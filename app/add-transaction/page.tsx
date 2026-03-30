import AddTransactionForm from "@/components/forms/AddTransactionForm";

export default function AddTransactionPage() {
  return (
    <div className="container-page space-y-6">
      <h1 className="heading-1">Add Transaction</h1>
      <div className="glass p-4">
        <AddTransactionForm />
      </div>
    </div>
  );
}

