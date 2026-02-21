import { Partner } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Home, User } from 'lucide-react';

interface PartnerCardProps {
  partner: Partner;
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const getRelationshipIcon = () => {
    switch (partner.relationshipType) {
      case 'romantic':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      case 'friend':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'family':
        return <Home className="w-5 h-5 text-blue-500" />;
      default:
        return <User className="w-5 h-5 text-pink-500" />;
    }
  };

  const getRelationshipColor = () => {
    switch (partner.relationshipType) {
      case 'romantic':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'friend':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'family':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-rose-200/50 dark:border-rose-900/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
              {getRelationshipIcon()}
            </div>
            <div>
              <CardTitle className="text-xl">{partner.name}</CardTitle>
              <Badge className={`mt-1 ${getRelationshipColor()} border-0`}>
                {partner.relationshipType}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Connected since:</span>
            <span>{formatDate(partner.connectionDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
