"use client";

import React, { useState } from "react";
import { formData } from "./page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateProfile } from "@/actions/profile";

export default function Form({ profile }: { profile: formData }) {
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [enableEdit, setenableEdit] = useState(!profile.firstName);
  const [currProfile, setCurrProfile] = useState<formData>(
    profile || {
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
    }
  );

  function handleChange(e: any) {
    setCurrProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setDisableSubmit(true);
    const error = await UpdateProfile(currProfile);
    if (error) {
      alert(error);
    }
    setDisableSubmit(false);
    setenableEdit(false);
  }

  return enableEdit ? (
    <form
      onSubmit={handleSubmit}
      className="flex mt-2 flex-col xgap-4 md:grid grid-cols-2 xl:gap-8"
    >
      <div className="flex flex-col">
        <label className="py-2" htmlFor="first-name">
          First name
        </label>
        <Input
          type="text"
          name="firstName"
          id="first-name"
          placeholder="First name..."
          required
          value={currProfile?.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label className="py-2" htmlFor="last-name">
          Last name
        </label>
        <Input
          type="text"
          name="lastName"
          id="last-name"
          placeholder="Last name..."
          value={currProfile?.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label className="py-2" htmlFor="phone">
          Mobile Number
        </label>
        <Input
          type="text"
          name="phone"
          id="phone"
          placeholder="eg: +91 1234567890"
          value={currProfile?.phone}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <div className="py-2">Gender:</div>
        <div className="flex gap-4 h-full px-4">
          <label className="flex items-center gap-2">
            <Input
              name="gender"
              type="radio"
              value="male"
              defaultChecked={currProfile?.gender === "male"}
              onChange={handleChange}
            />
            Male
          </label>
          <label className="flex items-center gap-2">
            <Input
              name="gender"
              type="radio"
              value="female"
              defaultChecked={currProfile?.gender === "female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>
      </div>
      <div className="col-span-2 flex justify-end gap-4">
        <Button size="sm" disabled={disableSubmit}>
          Save
        </Button>

        <Button size="sm" type="button" onClick={() => setenableEdit(false)}>
          Cancel
        </Button>
      </div>
    </form>
  ) : (
    <div className="flex mt-2 flex-col gap-4 md:grid grid-cols-2 xl:gap-8">
      <div className="flex flex-col">
        <h3 className="py-2">First name</h3>
        <div className="p-2 font-bold">{currProfile?.firstName}</div>
      </div>

      <div className="flex flex-col">
        <h3 className="py-2">Last name</h3>
        <div className="p-2 font-bold">{currProfile?.lastName}</div>
      </div>

      <div className="flex flex-col">
        <h3 className="py-2">Mobile Number</h3>
        <div className="p-2 font-bold">{currProfile?.phone}</div>
      </div>

      <div className="flex flex-col">
        <h3 className="py-2">Gender</h3>
        <div className="p-2 font-bold">
          {currProfile?.gender?.toUpperCase()}
        </div>
      </div>

      <div className="col-span-2 flex justify-end gap-4">
        <Button size="sm" onClick={() => setenableEdit(true)}>
          Edit
        </Button>
      </div>
    </div>
  );
}
