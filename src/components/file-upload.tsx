'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { FieldValues, UseFormRegister } from 'react-hook-form';
import { MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from '@/lib/utils';
import { X } from 'lucide-react';

interface FileUploadProps {
  name: string;
  defaultValue?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
}

export default function FileUpload({ name, defaultValue, required, register }: FileUploadProps) {
  const [file, setFile] = useState<File | string | undefined>(defaultValue);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-center w-full">
        <label
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-zinc-500/50 hover:bg-zinc-300/30"
          htmlFor={name}>
          <p className="text-sm text-white font-semibold">
            Click to upload
          </p>
          {file && (
            <div className="relative h-20 w-20 mt-1">
              <Image
                fill
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt="Image preview"
                className="rounded-full mx-0"
              />
              <X
                className="absolute top-0 right-0 w-6 h-6 text-white bg-red-500 rounded-full"
                onClick={() => setFile(undefined)}
              />
            </div>
          )}
          {!file && (
            <input
              className="hidden"
              type="file"
              id={name}
              {...register(name, {
                required: required ? `${name} is required` : false,
                validate: {
                  lessThan10MB: (files: FileList) => files?.[0]?.size < MAX_FILE_SIZE,
                  acceptedFormats: (files: FileList) => SUPPORTED_FILE_TYPES.includes(files?.[0]?.type)
                },
                onChange: (e) => setFile(e.target.files?.[0])
              })}
            />
          )}
        </label>
      </div>
    </div>
  );
}
