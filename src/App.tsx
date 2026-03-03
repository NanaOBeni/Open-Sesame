import { useState, useEffect } from "react"
import { uppercase_exist, special_exist, minimun_8, greek_exist } from "../lib/rules"
const fullTitle = 'Open Sesamee'
const fullSubtitle = 'a game not at all inspired by The Password Game'
const fullLabel = 'Please enter your password:'

export default function App() {
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [label, setLabel] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  const [RulesFinished, setRulesFinished] = useState(1)

  const ruleDisplay = [
  { fn: uppercase_exist, description: 'Must contain an uppercase letter' },
  { fn: special_exist, description: 'Must contain a special character' },
  { fn: minimun_8, description: 'Must be at least 8 characters' },
  { fn: greek_exist, description: 'Must contain a Greek letter' },]

  const ruleArr = [
    uppercase_exist, special_exist, minimun_8, greek_exist
  ]

  /*useEffect(() => {
    if (ruleArr[RulesFinished - 1]!(password)) {
      setRulesFinished(RulesFinished + 1)
    }
  }, [password])*/
  useEffect(() => {
    let identifier = true
    for (let i = 0; i < RulesFinished; i++) {
      if (!ruleArr[i]!(password)) {
        identifier = false
        break
      }
    }
    if (identifier === true) {
      setRulesFinished(RulesFinished + 1)
    }
  }, [password])

  const currentRule = ruleDisplay[RulesFinished - 1]

  /*useEffect(() => {
    if (ruleArr[RulesFinished]!(password)) {
      setRulesFinished(RulesFinished + 1)
    }
  }, [password])*/

  useEffect(() => {
    const texts = [
      { set: setTitle, text: fullTitle, speed: 150 },
      { set: setSubtitle, text: fullSubtitle, speed: 75 },
      { set: setLabel, text: fullLabel, speed: 50 },
    ]

    function typeText(index: number) {
      if (index >= texts.length) return
      const { set, text, speed } = texts[index]!
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          set(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          typeText(index + 1)
          if (index === 2) {
            setTypingDone(true)
          }
        }
      }, speed)
    }

    typeText(0)
  }, [])

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #e3b4e5, #1c0f24)',
      minHeight: '100vh'
      }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          color: '#3f2e5b',
          paddingTop: '10vh',
          fontFamily : 'Georgia, serif',
          fontSize: '60px'
          }}>
          {title}
        </h1>
        <p style={{
          color: '#3f2e5b',
          marginTop: '-2vh',
          fontSize: '30px',
          fontFamily: 'Georgia, serif',
          paddingBottom: '3vh' 
          }}>
          {subtitle}
        </p >

        <label
        style={{
          color: '#3f2e5b',
          paddingRight: '25vh',
          fontFamily: 'Georgia, serif',
          fontSize: '25px',
          marginBottom: '-8px',
          display: 'block',
        }} 
        htmlFor="typearea">{label}</label><br />
          <textarea 
            id="typearea"
            rows={1}
            value={password} 
            onChange={(typing) => setPassword(typing.target.value)}
            style={{
              opacity: typingDone ? 1: 0,
              transition: 'opacity 0.75s ease-in',
              minHeight: '30px',
              paddingTop: '5px',
              paddingBottom: '5px',
              paddingLeft: '5px',
              paddingRight: '5px',
              resize: 'none',
              overflow: 'hidden',
              width: '49vh',
              fontSize: '25px',
              border: '5px solid #3f2e5b',
              borderRadius: '8px',
              boxSizing: 'border-box'
            }}
            onInput={(event) => {
              const el = event.target as HTMLTextAreaElement
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          opacity: typingDone ? 1: 0,
          transition: 'opacity 0.75s ease-in',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          paddingLeft: '10px',
          paddingRight: '10px',
          fontFamily: 'Georgia, serif',
          fontSize: '20px',
          textAlign: 'center'
          }}>
        {ruleDisplay.slice(0, RulesFinished).reverse().map((rule) => (
        <p key={rule.description} className="rule-item" style={{ 
        marginTop: '0px',
        color: rule.fn(password) ? 'green' : 'red',
        width: '300px',
        border: rule.fn(password) ? '5px solid green' : '5px solid red',
        borderRadius: '8px',
        backgroundColor: rule.fn(password) ? '#9FFF96' : '#FFA696',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '10px',
        paddingRight: '10px'
        }}>
        {rule.description}
        </p>))}
      </div>
    </div>
  )
}