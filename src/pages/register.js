import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { useAuthState, useAuthDispatch } from "../context/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  const { register: createUser } = useAuthDispatch();
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
    setError,
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const onSubmit = async ({ name, email, password }) => {
    try {
      await createUser({ name, email, password });

      router.push("/");
    } catch ({ message }) {
      setError("email", {
        type: "manual",
        message,
      });
    }
  };

  return (
    <>
      <h1 className="text-3xl">Create an account</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            name="name"
            id="name"
            ref={register({
              required: "You must provide a name.",
            })}
            placeholder="Your name"
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            id="email"
            ref={register({
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              required: "You must provide a email.",
            })}
            placeholder="Your email"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            ref={register({
              required: "You must provide a password.",
              minLength: {
                message: "Your password must be at least 6 characters",
                value: 6,
              },
            })}
            placeholder="Choose a password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Create account
          </button>
        </div>
      </form>
    </>
  );
}
