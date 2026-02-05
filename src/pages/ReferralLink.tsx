import React, { useState } from 'react';
import { Copy, Check, QrCode, Link2, Info, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReferralInfo } from '@/hooks/use-api';

const ReferralLink: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { data: referralInfo, isLoading, error } = useReferralInfo();

  const referralCode = referralInfo?.referral_code || 'PARTNER2024';
  const referralLink = referralInfo?.referral_link || `https://karirnusantara.id/register?ref=${referralCode}`;

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
      toast.success(`${type === 'link' ? 'Link' : 'Code'} copied to clipboard!`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  // Generate QR code URL using a free API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}`;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12" />
        <p>Failed to load referral information</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Referral Link & Code</h1>
        <p className="mt-1 text-muted-foreground">
          Share your unique referral link to earn commissions
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referral Link Card */}
        <div className="stat-card animate-fade-in space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Your Referral Link</h2>
              <p className="text-sm text-muted-foreground">Share this link with companies</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="break-all text-sm font-medium text-foreground">{referralLink}</p>
            </div>
            <Button
              onClick={() => copyToClipboard(referralLink, 'link')}
              className="w-full"
              variant={copiedLink ? 'secondary' : 'default'}
            >
              {copiedLink ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Referral Code:</span>
              <code className="rounded bg-secondary px-2 py-1 text-sm font-bold text-secondary-foreground">
                {referralCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(referralCode, 'code')}
              >
                {copiedCode ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="stat-card animate-fade-in space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <QrCode className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">QR Code</h2>
              <p className="text-sm text-muted-foreground">Scan to open referral link</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="rounded-xl bg-card border border-border p-4">
              <img
                src={qrCodeUrl}
                alt="Referral QR Code"
                className="h-48 w-48"
              />
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a href={qrCodeUrl} download={`referral-qr-${referralCode}.png`}>
              Download QR Code
            </a>
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="stat-card animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
            <Info className="h-5 w-5 text-info" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">How It Works</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              1
            </div>
            <h3 className="font-medium text-foreground">Share Your Link</h3>
            <p className="text-sm text-muted-foreground">
              Send your unique referral link to companies looking to hire talent
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              2
            </div>
            <h3 className="font-medium text-foreground">Company Registers</h3>
            <p className="text-sm text-muted-foreground">
              When they sign up using your link, they're automatically linked to your account
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              3
            </div>
            <h3 className="font-medium text-foreground">Earn Commission</h3>
            <p className="text-sm text-muted-foreground">
              Receive 40% commission on every job posting package they purchase
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="stat-card animate-fade-in bg-secondary/30">
        <h3 className="font-semibold text-foreground mb-3">Pro Tips for Success</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            Target HR managers and recruiters in growing companies
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            Share in professional networks like LinkedIn and industry groups
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            Highlight Karir Nusantara's benefits: wide reach, quality candidates, competitive pricing
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            Follow up with referrals to ensure they complete registration
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralLink;
