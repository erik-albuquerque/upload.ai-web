'use client'

import { Github, Wand2, Info, AlertTriangle } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Separator } from '@components/ui/separator'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'

import { Slider } from '@components/ui/slider'
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { VideoInputForm } from '@components/forms/video-input-form'
import { PromptSelect } from '@components/prompt-select'
import { useState } from 'react'
import { useCompletion } from 'ai/react'

const App = () => {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.5)

  const {
    input,
    setInput,
    completion,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/completion',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-type': 'application/json',
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">🤍</span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </header>

      {/* main */}
      <main className="flex-1 p-6 flex gap-6">
        {/* textarea content */}
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />

            <Textarea
              className="resize-none p-4 leading-relaxed focus-visible:ring-transparent"
              placeholder="Resultado gerado pela IA..."
              value={completion}
              readOnly
            />
          </div>

          {/* footer */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              Lembre-se: você pode utilizar a variável{' '}
              <code className="text-violet-400">{'{transcription}'}</code> no
              seu prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </AlertDescription>
          </Alert>
        </div>
        {/* side bar */}
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          {/* prompt form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>

              <PromptSelect onPromptSelected={setInput} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Modelo</Label>

              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                  Você poderá customizar essa opção em breve.
                </AlertDescription>
              </Alert>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Temperatura</Label>
                <span className="text-xs text-muted-foreground">
                  {temperature}
                </span>
              </div>

              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
                  Valores elevados têm a tendência de promover um resultado mais
                  criativo, embora possam também acarretar possíveis erros.
                </AlertDescription>
              </Alert>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}

export default App
