import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const ForgotPassword: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.forgotPassword(email);
      if (result.success) {
        setIsSuccess(true);
        toast.success('Reset link sent! Check your email.');
      } else {
        // Still show success to prevent email enumeration
        setIsSuccess(true);
        toast.success('If an account exists, a reset link has been sent.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
            <p className="mt-4 text-muted-foreground">
              We've sent a password reset link to:
            </p>
            <p className="mt-2 font-medium text-foreground">{email}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Click the link in the email to reset your password
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                The link will expire in 1 hour
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                If you don't see the email, check your spam folder
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={() => setIsSuccess(false)} 
              className="w-full"
            >
              Send again
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-primary-foreground">KN</span>
            </div>
            <span className="text-xl font-bold">Karir Nusantara</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Forgot password?</h2>
          <p className="mt-2 text-muted-foreground">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <Button type="submit" className="h-12 w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>

        <Link to="/login" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
