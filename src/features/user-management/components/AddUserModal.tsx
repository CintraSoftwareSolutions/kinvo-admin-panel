import { useState } from 'react'
import { Modal } from '../../../shared/components/Modal'
import { Input } from '../../../shared/forms/Input'
import { Select } from '../../../shared/forms/Select'
import { Textarea } from '../../../shared/forms/Textarea'

type AddUserModalProps = {
  open: boolean
  onClose: () => void
}

export function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <Modal open={open} title="Add new user" onClose={onClose}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
          window.setTimeout(() => {
            setSubmitted(false)
            onClose()
          }, 500)
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" placeholder="Alex Morgan" required />
          <Input label="Email" type="email" placeholder="alex@kinvo.app" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Subscription plan" defaultValue="Premium Monthly">
            <option>Premium Monthly</option>
            <option>Fitness Pro</option>
            <option>Pet Plus</option>
            <option>Student Plus</option>
          </Select>
          <Select label="Mode focus" defaultValue="Coffee dates">
            <option>Coffee dates</option>
            <option>Morning runs</option>
            <option>Founder intros</option>
            <option>Study sessions</option>
          </Select>
        </div>
        <Textarea label="Operator note" placeholder="Add context for the support team" />
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(111,61,204,0.26)]"
          >
            {submitted ? 'Adding...' : 'Add user'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
