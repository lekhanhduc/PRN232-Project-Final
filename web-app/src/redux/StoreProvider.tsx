'use client'
import { useRef } from 'react'
import { AppStore, makeStore } from './store'
import { Provider } from 'react-redux'
import AuthInitializer from '@/components/auth/AuthInitializer'

export default function StoreProvider({
    children
}: {
    children: React.ReactNode
}) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current}>
            <AuthInitializer>
                {children}
            </AuthInitializer>
        </Provider>
    )
}