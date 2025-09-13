interface ScoreBadgeProps {
  score: number
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Good'
    if (score >= 50) return 'OK'
    return 'Bad'
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full ${getScoreColor(score)} flex items-center justify-center text-white font-bold text-lg`}>
        {score}
      </div>
      <span className={`text-xs mt-1 font-medium ${
        score >= 80 ? 'text-green-600' : 
        score >= 50 ? 'text-yellow-600' : 
        'text-red-600'
      }`}>
        {getScoreText(score)}
      </span>
    </div>
  )
}