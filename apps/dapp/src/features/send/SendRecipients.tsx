import { SendFormData } from "./shared";
import { TrashIcon } from "@heroicons/react/solid";
import { isAddress } from "@polkadot/util-crypto";
import clsx from "clsx";
import { useCallback } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";

export const SendRecipients = () => {
  const {
    register,
    formState: { errors },
    getValues,
    trigger,
  } = useFormContext<SendFormData>();

  const { fields, append, remove, update } = useFieldArray<SendFormData>({
    name: "recipients",
  });

  const autoAppend = useCallback(() => {
    const { recipients } = getValues();
    if (recipients.every((field) => isAddress(field.address)))
      append({ address: "", name: "" });
    trigger();
  }, [append, getValues, trigger]);

  const handleRemove = useCallback(
    (index: number, isLast: boolean) => () => {
      if (isLast) update(index, { address: "", name: "" });
      else remove(index);
      autoAppend();
    },
    [autoAppend, remove, update]
  );

  return (
    <div className="flex flex-col w-full gap-2 mb-4">
      <div>Target frens :</div>
      {fields.map((field, index, arr) => (
        <div
          key={field.id}
          className={clsx(
            "flex w-full border rounded",
            "border-zinc-500 hover:border-zinc-400 focus-within:border-salmon-500 ",
            (errors.recipients as Record<number, FieldError>)?.[index] &&
              "!border-red-500"
          )}
        >
          <input
            type="text"
            className={clsx(
              "grow my-1 p-1 px-2 rounded bg-transparent text-white outline-none"
            )}
            placeholder="GM address"
            data-lpignore
            spellCheck={false}
            autoComplete="off"
            {...register(`recipients.${index}.address`, {
              onChange: autoAppend,
            })}
          />
          <button
            className="px-2 outline-none opacity-80 focus:opacity-100 hover:opacity-100 disabled:opacity-50"
            onClick={handleRemove(index, arr.length === index + 1)}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};