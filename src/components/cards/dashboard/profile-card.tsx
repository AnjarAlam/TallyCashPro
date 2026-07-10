"use client";

import { useState } from "react";
import { CheckCircle, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// -------------------- MyProfile --------------------
export const MyProfile = () => {
  const name = "Natashia Khaleira";
  const email = "info@binary-fusion.com";
  const initial = name[0];

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-400 text-white rounded-xl shadow-xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white text-green-800 font-bold text-3xl flex items-center justify-center shadow-md">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">{name}</h2>
              <span className="flex items-center gap-1 text-sm text-green-300 font-medium">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
            <p className="text-sm opacity-90">{email}</p>
            <p className="text-sm opacity-90">Admin · Leeds, United Kingdom</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------- PersonalInfo --------------------
export const PersonalInfo = () => {
  const [open, setOpen] = useState(false);
  const [personalData, setPersonalData] = useState({
    name: "Natashia Khaleira",
    dob: "1990-10-12",
    email: "info@binary-fusion.com",
    phone: "(+62) 821 2554 5846",
    role: "Admin",
  });
  const [editData, setEditData] = useState(personalData);

  const handleSave = () => {
    setPersonalData(editData);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">🧾 Personal Information</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-10 px-4">
              <Pencil className="w-5 h-5 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Personal Info</DialogTitle>
              <DialogDescription>Update your personal details below.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Date of Birth", name: "dob", type: "date" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "text" },
                { label: "Role", name: "role", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
                  <Input
                    type={type}
                    name={name}
                    value={editData[name as keyof typeof editData]}
                    onChange={(e) => setEditData({ ...editData, [name]: e.target.value })}
                  />
                </div>
              ))}
              <div className="text-right">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
        <div><strong>Name:</strong> {personalData.name}</div>
        <div><strong>Date of Birth:</strong> {personalData.dob}</div>
        <div><strong>Email:</strong> {personalData.email}</div>
        <div><strong>Phone:</strong> {personalData.phone}</div>
        <div><strong>Role:</strong> {personalData.role}</div>
      </div>
    </div>
  );
};

// -------------------- AddressInfo --------------------
export const AddressInfo = () => {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState({
    country: "United Kingdom",
    city: "Leeds, East London",
    postalCode: "ERT 1254",
  });
  const [editAddress, setEditAddress] = useState(address);

  const handleSave = () => {
    setAddress(editAddress);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">📍 Address</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-10 px-4">
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
              <DialogDescription>Update your location details below.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {[
                { label: "Country", name: "country" },
                { label: "City", name: "city" },
                { label: "Postal Code", name: "postalCode" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
                  <Input
                    name={name}
                    value={editAddress[name as keyof typeof editAddress]}
                    onChange={(e) => setEditAddress({ ...editAddress, [name]: e.target.value })}
                  />
                </div>
              ))}
              <div className="text-right">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
        <div><strong>Country:</strong> {address.country}</div>
        <div><strong>City:</strong> {address.city}</div>
        <div><strong>Postal Code:</strong> {address.postalCode}</div>
      </div>
    </div>
  );
};
