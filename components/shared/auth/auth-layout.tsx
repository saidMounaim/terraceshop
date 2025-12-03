import Image from "next/image";

export default function AuthLayout({
  children,
  title,
  subtitle,
  imageSrc = "/auth-bg.png",
}: {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  imageSrc?: string;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <Image
          src={imageSrc}
          alt="Fashion Editorial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute bottom-12 left-12 text-white p-6">
          <blockquote className="text-xl font-medium leading-relaxed">
            You can change your wife, your politics, your religion, but never,
            never can you change your favourite football team.
          </blockquote>
          <p className="mt-4 text-sm opacity-80">— Eric Cantona</p>
        </div>
      </div>
    </div>
  );
}
