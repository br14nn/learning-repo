"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  // start the sign up process.
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        password: password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div>
      {!pendingVerification && (
        <form>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              className="text-black"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              id="firstName"
              name="firstName"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              className="text-black"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              id="lastName"
              name="lastName"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="text-black"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              id="email"
              name="email"
              type="email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              className="text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              name="password"
              type="password"
            />
          </div>
          <button onClick={handleSubmit}>Sign up</button>
        </form>
      )}
      {pendingVerification && (
        <div>
          <form>
            <input
              className="text-black"
              value={code}
              placeholder="Code..."
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={onPressVerify}>Verify Email</button>
          </form>
        </div>
      )}
    </div>
  );
}
