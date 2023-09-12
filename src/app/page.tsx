import {
  Github,
  Clapperboard,
  Upload,
  Wand2,
  Info,
  AlertTriangle,
} from 'lucide-react'

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

const App = () => {
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
            />
            <Textarea
              className="resize-none p-4 leading-relaxed focus-visible:ring-transparent"
              placeholder="Resultado gerado pela IA..."
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
          {/* video form */}
          <form className="space-y-6">
            <Label
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 transition-colors"
            >
              <Clapperboard className="w-6  h-6" />
              Selecione um vídeo
            </Label>

            <input
              className="sr-only"
              type="file"
              id="video"
              accept="video/mp4"
            />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">
                Prompt de transcrição
              </Label>

              <Textarea
                id="transcription_prompt"
                className="min-h-[80px] leading-relaxed resize-none"
                placeholder="Inclua palavras-chaves mencionadas no vídeo separadas por vírgula (,)"
              />
            </div>

            <Button type="submit" className="w-full">
              Carregar vídeo
              <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <Separator />

          {/* prompt form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..." />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="title">Título do YouTube</SelectItem>

                  <SelectItem value="description">
                    Descrição do YouTube
                  </SelectItem>
                </SelectContent>
              </Select>
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
                <span className="text-xs text-muted-foreground">0.5</span>
              </div>

              <Slider defaultValue={[0.5]} min={0} max={1} step={0.1} />

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

            <Button type="submit" className="w-full">
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
