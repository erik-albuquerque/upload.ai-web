'use client'

import { ChangeEvent, FC, FormEvent, useMemo, useRef, useState } from 'react'

import { fetchFile } from '@ffmpeg/util'
import { getFFmpeg } from '@lib/ffmpeg'

import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'
import { Button } from '@components/ui/button'
import { Textarea } from '@components/ui/textarea'

import { Clapperboard, Upload } from 'lucide-react'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

const statusMessages = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!',
}

type VideoInputFormProps = {
  onVideoUploaded: (videoId: string) => void
}

type Video = {
  id: string
  name: string
  path: string
  transcription: string | null
  createdAt: Date
}

const VideoInputForm: FC<VideoInputFormProps> = ({
  onVideoUploaded,
}: VideoInputFormProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]

    console.log('selectedFile', selectedFile)

    setVideoFile(selectedFile)
  }

  const convertVideoToAudio = async (video: File) => {
    console.log('Convert started.')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // ffmpeg.on('log', (log) => console.log(log))

    ffmpeg.on('progress', (progress) => {
      console.log(`Convert progress: ${Math.round(progress.progress * 100)}`)
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const readOutputFile = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([readOutputFile], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finished.')

    return audioFile
  }

  const uploadAudioFile = async (audioFile: File) => {
    const formData = new FormData()

    formData.append('file', audioFile)

    const uploadVideoResponse = await fetch(
      'http://localhost:3333/videos/upload',
      {
        method: 'POST',
        body: formData,
      },
    )

    const uploadVideoData: { video: Video } = await uploadVideoResponse.json()

    const video = uploadVideoData.video

    return video
  }

  const generateTranscription = async (
    videoId: string,
    prompt: string | undefined, // FIX: is required, not optional
  ) => {
    await fetch(`http://localhost:3333/videos/${videoId}/transcription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    })
  }

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) return

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    setStatus('uploading')

    const video = await uploadAudioFile(audioFile)

    const videoId = video.id

    setStatus('generating')

    await generateTranscription(videoId, prompt)

    setStatus('success')

    onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return

    const previewURL = URL.createObjectURL(videoFile)

    setStatus('waiting')

    return previewURL
  }, [videoFile])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <Label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5 transition-colors overflow-hidden"
      >
        {previewURL ? (
          <video
            className="pointer-events-none absolute inset-0"
            src={previewURL}
            controls={false}
          />
        ) : (
          <>
            <Clapperboard className="w-6  h-6" />
            Selecione um vídeo
          </>
        )}
      </Label>

      <input
        id="video"
        className="sr-only"
        type="file"
        accept="video/mp4"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>

        <Textarea
          className="min-h-[80px] leading-relaxed resize-none"
          id="transcription_prompt"
          placeholder="Inclua palavras-chaves mencionadas no vídeo separadas por vírgula (,)"
          ref={promptInputRef}
          disabled={status !== 'waiting'}
        />
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === 'waiting' ? (
          <>
            Carregar video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  )
}

export { VideoInputForm }
