'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { FC, useEffect, useState } from 'react'

type Prompts = {
  id: string
  title: string
  template: string
}[]

type PromptSelectProps = {
  onPromptSelected: (template: string) => void
}

const PromptSelect: FC<PromptSelectProps> = ({
  onPromptSelected,
}: PromptSelectProps) => {
  const [prompts, setPrompts] = useState<Prompts | null>(null)

  const handlePromptSelected = (promptId: string) => {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === promptId)

    if (!selectedPrompt) return

    onPromptSelected(selectedPrompt.template)
  }

  useEffect(() => {
    fetch('http://localhost:3333/prompts').then((response) => {
      response
        .json()
        .then((data: { prompts: Prompts | null }) => setPrompts(data.prompts))
    })
  }, [])

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>

      <SelectContent>
        {prompts?.map((prompt) => (
          <SelectItem key={prompt.id} value={prompt.id}>
            {prompt.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { PromptSelect }
