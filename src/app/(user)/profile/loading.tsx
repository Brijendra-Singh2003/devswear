import React from 'react'
import { FormSkeleton } from './Form';

export default function loading() {
    return (
        <div className="flex flex-col gap-4 p-4">
          <div className="p-4 md:px-8 max-w-4xl w-full mx-auto bg-popover shadow-md rounded-xl">
            <h1 className="text-xl mt-4 mb-2 md:text-2xl">
              <b>My Profile</b>
            </h1>
            <hr />
            {FormSkeleton}
          </div>
        </div>
      );
}
