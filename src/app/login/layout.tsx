// app/login/layout.tsx
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex items-center justify-center h-screen '>
      <div className='w-full max-w-md p-6 bg-white shadow-lg rounded-lg'>
        {children}
      </div>
    </div>
  )
}
