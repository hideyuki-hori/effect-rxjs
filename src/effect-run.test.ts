import { describe, expect, it } from '@effect/vitest'
import { Effect } from 'effect'

describe('Effect.run*', () => {
  it('Effect.runSync', async () => {
    const parse = (input: string) =>
      Effect.try({
        try: () => JSON.parse(input),
        catch: (error) => new Error(`Failed to parse JSON: ${error}`)
      })

    const program = parse('{"foo": 1}')
    // resultがany型になる
    // run* を実行するまで動かない
    const result = Effect.runSync(program)
    expect(result.foo).toEqual(1)
  })

  it('Effect.runSyncExit', async () => {
    const parse = (input: string) =>
      Effect.try<{ foo:number}, Error>({
        try: () => JSON.parse(input),
        catch: (error) => new Error(`Failed to parse JSON: ${error}`)
      })
    const program = parse('{"foo":s 1}')
    // すぐ終わるらしい(textだからか終わらない)
    const result = Effect.runSyncExit(program)
    if (result._tag === 'Success') {
      expect(result.value.foo).toEqual(1)
    } else if (result._tag === 'Failure') {
      if (result.cause._tag === 'Fail') {
        expect(result.cause.error.message.startsWith('Failed to parse JSON')).toBeTruthy()
      } else {
        expect.fail('Unexpected cause')
      }
    }
  })

  it('Effect.runPromise', async () => {
    const parse = (input: string) =>
      Effect.tryPromise({
        // Promiseを返さないとエラーになる
        try: () => Promise.resolve(JSON.parse(input)),
        catch: (error) => new Error(`Failed to parse JSON: ${error}`)
      })

    const program = parse('{"foo": 1}')
    const result = await Effect.runPromise(program)
    // resultがunknown型になるのでcastが必要
    const asAny = result as any
    expect(asAny.foo).toEqual(1)
  })

  // 使い所を作るのがめんどくさいので確認を後回しにする
  // Effect.runCallback
  // Effect.runFork
  // Effect.runRequestBlock
})
