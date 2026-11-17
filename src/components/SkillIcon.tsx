import {
  BookOpen,
  Box,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  MessageSquare,
  Network,
  Server,
  Shield,
  Target,
  Terminal,
  Users,
  Workflow,
} from 'lucide-react';

interface SkillIconProps {
  iconKey: string;
  className?: string;
}

export function SkillIcon({ iconKey, className = 'w-5 h-5' }: SkillIconProps) {
  switch (iconKey) {
    case 'code':
      return <Code2 className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'gitBranch':
      return <GitBranch className={className} />;
    case 'layout':
      return <LayoutGrid className={className} />;
    case 'box':
      return <Box className={className} />;
    case 'server':
      return <Server className={className} />;
    case 'check':
      return <CheckCircle2 className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'workflow':
      return <Workflow className={className} />;
    case 'network':
      return <Network className={className} />;
    case 'users':
      return <Users className={className} />;
    case 'book':
      return <BookOpen className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'message':
      return <MessageSquare className={className} />;
    default:
      return <Code2 className={className} />;
  }
}
