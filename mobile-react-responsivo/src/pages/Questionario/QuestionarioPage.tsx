import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import QuizIcon from '@mui/icons-material/Quiz'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { COLORS } from '@/theme'
import { getQuestionario } from '@/services/api'
import AppShell from '@/components/AppShell'
import type { Questionario, RespostaQuestionario } from '@/types'

export default function QuestionarioPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [questionario, setQuestionario] = useState<Questionario | null>(null)
  const [respostas, setRespostas] = useState<Record<string, string | number>>({})
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getQuestionario(id).then(setQuestionario).catch(console.error).finally(() => setLoading(false))
  }, [id])

  const handleResposta = (perguntaId: string, valor: string | number) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }))
  }

  const handleEnviar = () => {
    if (!questionario) return
    const obrigatorias = questionario.perguntas.filter((p) => p.obrigatoria)
    const todasRespondidas = obrigatorias.every((p) => respostas[p.id] !== undefined && respostas[p.id] !== '')
    if (!todasRespondidas) { alert('Responda todas as perguntas obrigatórias.'); return }
    Object.entries(respostas).map(([id, val]) => ({ perguntaId: id, resposta: val })) as RespostaQuestionario[]
    setEnviado(true)
  }

  if (loading) return (
    <Box sx={{ minHeight: '100svh', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: COLORS.orange }} />
    </Box>
  )

  if (enviado) return (
    <AppShell showNav={false}>
      <Box sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, gap: 3, textAlign: 'center' }}>
        <Box sx={{ width: 120, height: 120, borderRadius: '50%', background: COLORS.greenMuted, border: `3px solid ${COLORS.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: COLORS.green }} />
        </Box>
        <Typography variant="h5" sx={{ color: COLORS.green, fontWeight: 700 }}>Questionário Enviado!</Typography>
        <Typography sx={{ color: COLORS.gray3, fontSize: 14, lineHeight: 1.6 }}>Suas respostas foram registradas com sucesso. Obrigado pela colaboração!</Typography>
        <Button variant="contained" onClick={() => navigate('/home')}>Voltar ao Início</Button>
      </Box>
    </AppShell>
  )

  const progresso = questionario
    ? (Object.keys(respostas).length / questionario.perguntas.length) * 100
    : 0

  return (
    <AppShell showNav={false}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <QuizIcon sx={{ mr: 1, ml: 1, color: COLORS.orange }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16 }}>
            {questionario?.titulo ?? 'Questionário'}
          </Typography>
        </Toolbar>
        <LinearProgress
          variant="determinate"
          value={progresso}
          sx={{ '& .MuiLinearProgress-bar': { background: COLORS.orange } }}
        />
      </AppBar>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {questionario?.perguntas.map((p, i) => (
          <Box key={p.id} sx={{ background: COLORS.surface, borderRadius: 2, p: 2, border: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'flex-start' }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: COLORS.orangeMuted, border: `1px solid ${COLORS.orangeBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Typography sx={{ color: COLORS.orange, fontSize: 12, fontWeight: 700 }}>{i + 1}</Typography>
              </Box>
              <Typography sx={{ color: COLORS.white, fontSize: 14, lineHeight: 1.5 }}>
                {p.texto}
                {p.obrigatoria && <Typography component="span" sx={{ color: COLORS.red, ml: 0.5 }}>*</Typography>}
              </Typography>
            </Box>

            {p.tipo === 'multipla_escolha' && (
              <RadioGroup value={respostas[p.id] ?? ''} onChange={(e) => handleResposta(p.id, e.target.value)}>
                {p.opcoes?.map((op) => (
                  <FormControlLabel
                    key={op} value={op} label={op}
                    control={<Radio size="small" sx={{ color: COLORS.border, '&.Mui-checked': { color: COLORS.orange } }} />}
                    sx={{ '.MuiFormControlLabel-label': { color: COLORS.gray1, fontSize: 14 } }}
                  />
                ))}
              </RadioGroup>
            )}

            {p.tipo === 'texto' && (
              <TextField
                fullWidth multiline rows={3} size="small"
                placeholder="Escreva sua resposta..."
                value={respostas[p.id] ?? ''}
                onChange={(e) => handleResposta(p.id, e.target.value)}
              />
            )}

            {p.tipo === 'escala' && (
              <Box sx={{ px: 1 }}>
                <Slider
                  min={1} max={5}
                  value={Number(respostas[p.id] ?? 3)}
                  onChange={(_, val) => handleResposta(p.id, val as number)}
                  marks={[1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }))}
                  sx={{ color: COLORS.orange, '& .MuiSlider-markLabel': { color: COLORS.gray3 } }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: COLORS.gray4, fontSize: 11 }}>Ruim</Typography>
                  <Typography sx={{ color: COLORS.gray4, fontSize: 11 }}>Excelente</Typography>
                </Box>
              </Box>
            )}
          </Box>
        ))}

        <Button variant="contained" onClick={handleEnviar} sx={{ mt: 1 }}>
          Enviar Respostas
        </Button>
      </Box>
    </AppShell>
  )
}
