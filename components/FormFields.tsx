import React from "react";
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import { Control, Controller, FieldValues, Path } from "react-hook-form";
interface FormFieldProps<T extends FieldValues> {
    control: Control<T>; // Replace with the appropriate type for your control prop
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file';
  }

export const FormField = <T extends FieldValues>({ control, name, label, placeholder, type = "text" }: FormFieldProps<T>) => {
    return(
        <Controller name={name} control={control} render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-bold text-[#c0fe72] mb-2 block">{label}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={placeholder} 
                    {...field} 
                    type={type} 
                    className="w-full p-4 rounded-xl !bg-black !text-white border-2 border-gray-700 focus:border-[#c0fe72] focus:outline-none text-base placeholder:text-gray-500 transition-all"
                    style={{ backgroundColor: '#000000', color: '#ffffff' }}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-sm mt-1" />
              </FormItem>
            )}
          />
    )
}