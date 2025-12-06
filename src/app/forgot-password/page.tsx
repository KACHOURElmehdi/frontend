'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // TODO: Implement actual password reset API call
            // await api.post('/auth/forgot-password', { email });
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            setIsSubmitted(true);
        } catch (err: unknown) {
            const errorMessage = err && typeof err === 'object' && 'response' in err 
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
                : 'Failed to send reset link. Please try again.';
            setError(errorMessage || 'Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 grid-pattern" />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
                            <Zap className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">DocClassifier</span>
                    </Link>
                    
                    <div className="max-w-md">
                        <h1 className="text-4xl font-bold mb-6">
                            Don&apos;t worry, it happens to the best of us
                        </h1>
                        <p className="text-lg text-white/80">
                            We&apos;ll send you a secure link to reset your password and get you back to managing your documents in no time.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <span>🔐 Secure password reset</span>
                        <span>•</span>
                        <span>Link expires in 1 hour</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-foreground">DocClassifier</span>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <Link 
                                href="/login" 
                                className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground mb-8 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to sign in
                            </Link>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-foreground mb-2">Reset your password</h2>
                                <p className="text-foreground-muted">
                                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-error-light border border-error/20 text-error text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        leftIcon={Mail}
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    variant="gradient" 
                                    className="w-full" 
                                    size="lg"
                                    isLoading={isLoading}
                                >
                                    Send reset link
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-sm text-foreground-muted">
                                Remember your password?{' '}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-success" />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
                            <p className="text-foreground-muted mb-6">
                                We&apos;ve sent a password reset link to{' '}
                                <span className="font-medium text-foreground">{email}</span>
                            </p>
                            
                            <div className="p-4 rounded-xl bg-background-subtle border border-border mb-6">
                                <p className="text-sm text-foreground-muted">
                                    Didn&apos;t receive the email? Check your spam folder or{' '}
                                    <button 
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        try another email address
                                    </button>
                                </p>
                            </div>

                            <Link href="/login">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to sign in
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
