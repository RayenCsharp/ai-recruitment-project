import { Listbox } from '@headlessui/react'
import { useState } from 'react'

export default function CustomSelect({ options }) {
  const [selected, setSelected] = useState(options[0])

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          
          <Listbox.Button className="w-full bg-surface border border-border text-text p-3 rounded-xl text-left hover:border-primary transition">
            {selected}
          </Listbox.Button>

          <Listbox.Options className="absolute mt-2 w-full bg-gray-100 border border-border rounded-xl shadow-lg z-10">
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                value={option}
                className={({ active }) =>
                  `p-3 cursor-pointer ${active ? 'bg-primary text-blue-700' : 'text-text'}`
                }
              >
                {option}
              </Listbox.Option>
            ))}
          </Listbox.Options>

        </div>
      </Listbox>
    </div>
  )
}