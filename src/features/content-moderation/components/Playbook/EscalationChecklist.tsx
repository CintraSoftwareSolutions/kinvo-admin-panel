import { escalationChecklistMock } from '../../data/playbook.mock'

export function EscalationChecklist() {
  return (
    <ol className="mt-6 grid gap-5 text-sm leading-6 text-slate-600">
      {escalationChecklistMock.map((item, index) => (
        <li key={item}>
          {index + 1}. {item}
        </li>
      ))}
    </ol>
  )
}
