import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import AvatarWrapper from '@polar-sh/ui/components/atoms/Avatar'
import Button from '@polar-sh/ui/components/atoms/Button'
import { formatCurrencyAndAmount } from '@polar-sh/ui/lib/money'
import { motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { EventCostBadge } from '../Events/EventCostBadge'
import { Section } from './Section'

export const Events = () => {
  const [eventOffset, setEventOffset] = useState(() => 7)
  const y = useMotionValue(0)
  const previousClosestIndexRef = useRef<number | null>(null)

  const keyframes = useMemo(
    () =>
      Array.from({ length: mockedEvents.length + 1 }, (_, i) => -750 + i * 50),
    [],
  )

  useMotionValueEvent(y, 'change', (latest) => {
    // Find the closest keyframe to the current position
    let closestIndex = 0
    let closestDistance = Math.abs(latest - keyframes[0])

    for (let i = 1; i < keyframes.length; i++) {
      const distance = Math.abs(latest - keyframes[i])
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    // Only update if we've moved to a different keyframe
    if (previousClosestIndexRef.current !== closestIndex) {
      previousClosestIndexRef.current = closestIndex
      // Update offset based on the current keyframe
      // Add 1 because we want to include events from the current keyframe onwards
      const newOffset = Math.min(closestIndex, mockedEvents.length)
      setEventOffset(newOffset)
    }
  })

  const profit = useMemo(() => {
    const events = mockedEvents.slice(-eventOffset)

    const profit = events.reduce((acc, event) => {
      return acc + event.cost.amount
    }, 0)

    return -profit
  }, [mockedEvents, eventOffset])

  return (
    <Section className="flex flex-col gap-y-32 py-0 md:py-0">
      <div className="dark:bg-polar-900 flex w-full flex-col gap-y-6 overflow-hidden rounded-4xl bg-gray-200 p-2 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-y-8 p-6 md:p-12">
          <span className="w-fit rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
            Now in Beta
          </span>
          <h3 className="text-5xl leading-tight! text-balance">
            A realtime view of your revenue & costs
          </h3>
          <p className="dark:text-polar-500 text-lg text-gray-500">
            Track revenue, costs & profits in realtime. Understand your business
            performance like never before.
          </p>
          <Link
            href="/docs/features/cost-insights/introduction"
            target="_blank"
          >
            <Button
              variant="secondary"
              className="rounded-full"
              wrapperClassNames="flex flex-row items-center gap-x-2"
            >
              <span>Read the docs</span>
              <ArrowOutwardOutlined fontSize="inherit" />
            </Button>
          </Link>
        </div>
        <div className="dark:bg-polar-950 flex w-full flex-1 flex-col gap-y-4 rounded-3xl bg-gray-100 p-8">
          <div className="flex flex-row items-center justify-between gap-x-4">
            <h3>Activity</h3>
            <div className="flex flex-row items-center gap-x-4">
              <div className="flex flex-row items-center gap-x-4 font-mono text-xs">
                <span>Profit</span>
                <span className="dark:text-polar-500 text-gray-500">
                  {formatCurrencyAndAmount(profit, 'USD', 2, 'compact', 12)}
                </span>
              </div>
            </div>
          </div>
          <div
            className="relative h-[356px] overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0rem, black .5rem, black calc(100% - .5rem), transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0rem, black .5rem, black calc(100% - .5rem), transparent 100%)',
            }}
          >
            <motion.div
              className="flex w-full flex-col gap-y-2 py-2"
              style={{ y }}
              initial={{
                y: '-100%',
              }}
              animate={{
                y: keyframes,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'loop',
                ease: [0.83, 0, 0.17, 1],
              }}
              whileInView="animate"
            >
              {mockedEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  className="dark:bg-polar-900 flex flex-row items-center gap-x-8 rounded-md border border-gray-100 bg-white p-2 pl-4 font-mono text-xs dark:border-white/5"
                >
                  <h3 className="w-36 truncate">{event.name}</h3>
                  <p className="dark:text-polar-500 hidden w-28 text-xs text-gray-500 md:flex">
                    {event.timestamp.toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex w-32 flex-row items-center justify-end gap-x-4">
                    <EventCostBadge
                      cost={event.cost.amount}
                      currency={event.cost.currency}
                      nonCostEvent={event.cost.amount === 0}
                    />
                    <AvatarWrapper
                      name={event.name}
                      avatar_url="/assets/landing/testamonials/emil.jpg"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  )
}

const mockedEvents = [
  {
    id: 1,
    name: 'OpenAI Inference',
    timestamp: new Date('2025-10-30T00:00:14Z'),
    cost: {
      amount: 24,
      currency: 'USD',
    },
  },
  {
    id: 2,
    name: 'Anthropic Inference',
    timestamp: new Date('2025-10-30T00:00:13Z'),
    cost: {
      amount: 15,
      currency: 'USD',
    },
  },
  {
    id: 3,
    name: 'Order Paid',
    timestamp: new Date('2025-10-30T00:00:12Z'),
    cost: {
      amount: -2500,
      currency: 'USD',
    },
  },
  {
    id: 4,
    name: 'Storage Upload',
    timestamp: new Date('2025-10-30T00:00:11Z'),
    cost: {
      amount: 33,
      currency: 'USD',
    },
  },
  {
    id: 5,
    name: 'Anthropic Inference',
    timestamp: new Date('2025-10-30T00:00:10Z'),
    cost: {
      amount: 28,
      currency: 'USD',
    },
  },
  {
    id: 6,
    name: 'OpenAI Inference',
    timestamp: new Date('2025-10-30T00:00:09Z'),
    cost: {
      amount: 24,
      currency: 'USD',
    },
  },
  {
    id: 7,
    name: 'Anthropic Inference',
    timestamp: new Date('2025-10-30T00:00:08Z'),
    cost: {
      amount: 15,
      currency: 'USD',
    },
  },
  {
    id: 8,
    name: 'Subscription Upgrade',
    timestamp: new Date('2025-10-30T00:00:07Z'),
    cost: {
      amount: -1000,
      currency: 'USD',
    },
  },
  {
    id: 9,
    name: 'Storage Upload',
    timestamp: new Date('2025-10-30T00:00:06Z'),
    cost: {
      amount: 33,
      currency: 'USD',
    },
  },
  {
    id: 10,
    name: 'Anthropic Inference',
    timestamp: new Date('2025-10-30T00:00:05Z'),
    cost: {
      amount: 21,
      currency: 'USD',
    },
  },
  {
    id: 11,
    name: 'OpenAI Inference',
    timestamp: new Date('2025-10-30T00:00:04Z'),
    cost: {
      amount: 29,
      currency: 'USD',
    },
  },
  {
    id: 12,
    name: 'Anthropic Inference',
    timestamp: new Date('2025-10-30T00:00:03Z'),
    cost: {
      amount: 52,
      currency: 'USD',
    },
  },
  {
    id: 13,
    name: 'OpenAI Inference',
    timestamp: new Date('2025-10-30T00:00:02Z'),
    cost: {
      amount: 78,
      currency: 'USD',
    },
  },
  {
    id: 14,
    name: 'Trial Started',
    timestamp: new Date('2025-10-30T00:00:01Z'),
    cost: {
      amount: 0,
      currency: 'USD',
    },
  },
  {
    id: 17,
    name: 'Customer Acquired',
    timestamp: new Date('2025-10-30T00:00:00Z'),
    cost: {
      amount: 5000,
      currency: 'USD',
    },
  },
]
