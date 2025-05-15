"use client";
import { useEffect, useState } from "react";
import { Button, Table, Loader, Modal, Divider } from "@mantine/core";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { axiosClient } from "@/lib/axiosClient";
import { IconCreditCard } from "@tabler/icons-react";
import CustomTextInput from "@/components/Utils/CustomTextInput";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function BillingForm({
  email,
  name,
  setEmail,
  setName,
}: {
  email: string;
  name: string;
  setEmail: (val: string) => void;
  setName: (val: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: { email, name },
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    await axiosClient.post("/api/billing/add-card", {
      email,
      name,
      paymentMethodId: paymentMethod.id,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-lg">
               
               <label className="block mb-0 font-medium">Email</label>

      <CustomTextInput
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
        <label className="block mb-0 font-medium">Full Name</label>
      <CustomTextInput
        placeholder="Enter Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
       <label className="block mb-0 font-medium">Card Details</label>
      <div className="border border-gray-200 p-4 rounded-md mb-6"
      style={
        {
            border: "1px solid #E7E7E9",
        }
      }
      >

        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <div className="flex justify-end gap-3">
        <Button
        size="md"
        radius={10}
        fw={400}
        variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!stripe || loading}
          loading={loading}
          size="md"
          radius={10}
          fw={400}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

function InvoiceTable({ customerId }: { customerId: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // function handleSave() {}

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await axiosClient.get(`/api/billing/history?customerId=${customerId}`);
        setInvoices(res.data.data);
      } catch (err) {
        console.error("Failed to fetch invoices", err);
        setInvoices([]); // fallback
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, [customerId]);

  if (loading) return <Loader />;

  if (error) {
    //   return <div className="text-center py-8 text-red-500">Unable to load billing history right now.</div>
    return <div className="text-center py-8 text-red-500">Found no billing history.</div>;
  }

  if (invoices.length === 0) {
    return <div className="text-center py-8 text-gray-500">No Billing History</div>;
  }

  return (
    <Table>
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} className="border-t border-gray-200">
            <td className="px-6 py-4 text-sm">
              {new Date(inv.created * 1000).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-sm">${(inv.amount_due / 100).toFixed(2)}</td>
            <td className="px-6 py-4 text-sm">{inv.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function BillingPage() {
  const customerId = "cus_sample123";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"card" | "bank">("card");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("billing_name");
    const savedEmail = localStorage.getItem("billing_email");

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);

    if (savedName && savedEmail) setIsSaved(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem("billing_name", name);
    localStorage.setItem("billing_email", email);
    setIsSaved(true);
  };

  const openModal = (type: "card" | "bank") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-gray-600 mb-8">
        Manage how you will be billed by ORCA. For questions about billing, contact billing@orca.com
      </p>

      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Your payment method</h2>
        <div
          className="rounded-lg p-5 flex justify-between items-center"
          style={{
            border: "1px solid #E7E7E9",
          }}
        >
          <div className="flex items-center">
            <IconCreditCard size={24} className="text-[#6D57FC] mr-3" />
            <span className="text-gray-600">No payment method added</span>
          </div>
          <Button onClick={() => openModal("card")} size="md" radius={10} fw={400}>
            Add Payment method
          </Button>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Billing details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">
              {isSaved ? "🔒" : ""}
              Name
            </label>
            <CustomTextInput
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaved}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              {isSaved ? "🔒" : ""}
              Email
            </label>

            <CustomTextInput
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSaved}
            />
          </div>
          {!isSaved && (
            <Button
              onClick={handleSave}
              size="md"
              radius={10}
              fw={400}
              className="bg-[#6D57FC] hover:bg-[#5A48D6] text-white"
            >
              Update
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Billing history</h2>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <InvoiceTable customerId={customerId} />
        </div>
      </div>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        padding="xl"
        size="xl"
        radius="md"
        title={
          <span className="text-3xl font-bold text-[#0C0A1C] block text-center w-full mt-8">
            Add Payment Method
          </span>
        }
        closeButtonProps={{
          className: "text-[#0C0A1C] hover:text-black bg-white rounded-lg hover:bg-white",
          style: { border: "1px solid #0C0A1C" },
          size: "sm",
        }}
        classNames={{
          body: "pb-0 pt-2 px-8",
          content: "rounded-2xl",
          header: "w-full flex justify-center pb-4 border-b border-[#E7E7E9]",
          title: "flex-1 text-center",
        }}
        styles={{ content: { height: "510px" } }}
      >
        <Divider className="mb-4" />
        <div className="py-4">
          <div className="flex mb-6 border rounded-md overflow-hidden">
            <button
              className={`flex-1 py-3 text-center ${modalType === "bank" ? "bg-[#6D57FC] text-white" : "bg-white"}`}
              onClick={() => setModalType("bank")}
              style={{
                border: "1px solid gray",
                borderRadius: "10px",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
            >
              US bank account
            </button>
            <button
              className={`flex-1 py-3 text-center ${modalType === "card" ? "bg-[#6D57FC] text-white" : "bg-white"}`}
              onClick={() => setModalType("card")}
              style={{
                border: "1px solid gray",
                borderRadius: "10px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
            >
              Card
            </button>
          </div>

          {modalType === "card" ? (
            <Elements stripe={stripePromise}>
              <BillingForm email={email} name={name} setEmail={setEmail} setName={setName} />
            </Elements>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-4 text-center text-gray-600">
                  Your bank information will be verified via micro-deposits to your checking
                  account.
                </p>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Routing number</label>
                  <CustomTextInput
                    type="text"
                    placeholder="Enter number"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    value={""}
                    onChange={ () => {
                        console.log('hi');
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Account number</label>
                  <CustomTextInput
                    type="text"
                    placeholder="Enter Account number"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    value={""}
                    onChange={ () => {
                        console.log('hi');
                    }}
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-medium">Confirm account number</label>
                  <CustomTextInput
                    type="text"
                    placeholder="Enter Confirm account number"
                    className="w-full p-3 border border-gray-200 rounded-md"
                    value={""}
                    onChange={ () => {
                        console.log('hi');
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    radius={10}
                    size="md"
                    fw={400}
                    className="bg-[#6D57FC] hover:bg-[#5A48D6] text-white px-8"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
