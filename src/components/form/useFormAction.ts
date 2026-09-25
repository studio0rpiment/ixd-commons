"use client";

import { useActionState, startTransition, type FormEvent } from "react";

/**
 * Wraps a server action for a form without React's automatic post-action reset,
 * so a validation error doesn't wipe what someone has typed.
 */
export function useFormAction<S>(action: (prev: Awaited<S>, form: FormData) => Promise<S>, initial: Awaited<S>) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => dispatch(data));
  };
  return { state, pending, onSubmit };
}
