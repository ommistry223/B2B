import React, { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection, {
  AnimatedGroup,
} from '../../components/ui/AnimatedSection'
import AnimatedGradientText from '../../components/ui/AnimatedGradientText'
import { Button } from '../../components/ui/shadcn-button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/shadcn-card'
import { Input } from '../../components/ui/shadcn-input'
import { Textarea } from '../../components/ui/shadcn-textarea'
import { Checkbox } from '../../components/ui/shadcn-checkbox'
import { Switch } from '../../components/ui/shadcn-switch'
import { Badge } from '../../components/ui/shadcn-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../../components/ui/shadcn-dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../components/ui/shadcn-alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/shadcn-tooltip'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/shadcn-tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/shadcn-accordion'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/shadcn-avatar'
import { Separator } from '../../components/ui/shadcn-separator'
import { Skeleton } from '../../components/ui/shadcn-skeleton'
import {
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Heart,
  Star,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react'

const ShadcnShowcase = () => {
  const [isChecked, setIsChecked] = useState(false)
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-4"
          >
            <AnimatedGradientText>Shadcn UI Components</AnimatedGradientText>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Beautifully designed, animated components built with Radix UI and
            Tailwind CSS
          </p>
        </AnimatedSection>

        {/* Buttons Section */}
        <AnimatedSection animation="slideRight" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Buttons</CardTitle>
              <CardDescription>
                Interactive buttons with smooth animations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Primary Button
                </Button>
                <Button variant="secondary" size="lg">
                  <Zap className="mr-2 h-4 w-4" />
                  Secondary
                </Button>
                <Button variant="outline" size="lg">
                  <Shield className="mr-2 h-4 w-4" />
                  Outline
                </Button>
                <Button variant="ghost" size="lg">
                  Ghost
                </Button>
                <Button variant="success" size="lg">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Success
                </Button>
                <Button variant="warning" size="lg">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Warning
                </Button>
                <Button variant="destructive" size="lg">
                  Delete
                </Button>
              </div>
              <Separator className="my-6" />
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Cards & Badges Section */}
        <AnimatedSection animation="fadeUp" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            <AnimatedGradientText>Cards & Badges</AnimatedGradientText>
          </h2>
          <AnimatedGroup stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Rocket />,
                  title: 'Fast Performance',
                  badge: 'New',
                  variant: 'default',
                },
                {
                  icon: <Shield />,
                  title: 'Secure',
                  badge: 'Pro',
                  variant: 'success',
                },
                {
                  icon: <TrendingUp />,
                  title: 'Growing',
                  badge: 'Hot',
                  variant: 'warning',
                },
              ].map((item, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl text-white">
                        {item.icon}
                      </div>
                      <Badge variant={item.variant}>{item.badge}</Badge>
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      This is an animated card with 3D tilt effect on hover
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Hover over this card to see the smooth 3D animation effect
                      in action.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </AnimatedGroup>
        </AnimatedSection>

        {/* Inputs & Forms Section */}
        <AnimatedSection animation="slideLeft" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Forms & Inputs</CardTitle>
              <CardDescription>
                Beautiful form controls with focus animations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Type your message here" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isChecked}
                  onCheckedChange={setIsChecked}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="airplane-mode" className="text-sm font-medium">
                  Enable notifications
                </label>
                <Switch
                  id="airplane-mode"
                  checked={isSwitchOn}
                  onCheckedChange={setIsSwitchOn}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit Form</Button>
            </CardFooter>
          </Card>
        </AnimatedSection>

        {/* Alerts Section */}
        <AnimatedSection animation="fadeUp" className="mb-16">
          <h2 className="text-3xl font-bold mb-6">
            <AnimatedGradientText>Alerts</AnimatedGradientText>
          </h2>
          <div className="space-y-4">
            <Alert variant="default">
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is a default alert with useful information.
              </AlertDescription>
            </Alert>
            <Alert variant="success">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your action was completed successfully.
              </AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Please be cautious about this action.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        </AnimatedSection>

        {/* Tabs Section */}
        <AnimatedSection animation="slideRight" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Tabs</CardTitle>
              <CardDescription>Switch between different views</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="account" className="flex-1">
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="password" className="flex-1">
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">
                    Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-4 pt-4">
                  <Input placeholder="Username" />
                  <Input placeholder="Email" type="email" />
                  <Button>Save Account</Button>
                </TabsContent>
                <TabsContent value="password" className="space-y-4 pt-4">
                  <Input placeholder="Current Password" type="password" />
                  <Input placeholder="New Password" type="password" />
                  <Button>Update Password</Button>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Switch />
                  </div>
                  <Button>Save Settings</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Accordion Section */}
        <AnimatedSection animation="fadeUp" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Accordion</CardTitle>
              <CardDescription>Expandable content sections</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern and uses
                    semantic HTML.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All components feature smooth animations powered by
                    Framer Motion.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it customizable?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely. You can customize colors, sizes, and animations
                    easily.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Dialog & Tooltip Section */}
        <AnimatedSection animation="slideLeft" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>Modal dialogs with animations</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tooltips</CardTitle>
                <CardDescription>Helpful hover information</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex gap-4 flex-wrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to favorites</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rate this item</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>More information</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* Avatar & Skeleton Section */}
        <AnimatedSection animation="fadeUp" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
                <CardDescription>User profile images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading Skeletons</CardTitle>
                <CardDescription>Placeholder content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection animation="scale" className="text-center">
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                All components are built with{' '}
                <AnimatedGradientText>Framer Motion</AnimatedGradientText>,
                <AnimatedGradientText> Radix UI</AnimatedGradientText>, and
                <AnimatedGradientText> Tailwind CSS</AnimatedGradientText>
              </p>
              <div className="flex gap-2 justify-center">
                <Badge variant="default">Animated</Badge>
                <Badge variant="success">Accessible</Badge>
                <Badge variant="secondary">Responsive</Badge>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default ShadcnShowcase
