import { useSettingsStore } from "@/stores/useSettingsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Switch might be missing in ui, will check or strictly use Select/Radio

export default function SettingsPage() {
    const { theme, tableDensity, sidebarDefaultOpen, setTheme, setTableDensity, setSidebarDefaultOpen } = useSettingsStore();

    return (
        <div className="space-y-6 pt-6 pl-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Theme</Label>
                            <div className="flex items-center space-x-2">
                                <Select value={theme} onValueChange={(val: any) => setTheme(val)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Display</CardTitle>
                        <CardDescription>Manage how data is presented.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Table Density</Label>
                            <RadioGroup defaultValue={tableDensity} onValueChange={(val: any) => setTableDensity(val)} className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="compact" id="density-compact" />
                                    <Label htmlFor="density-compact">Compact</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="comfortable" id="density-comfortable" />
                                    <Label htmlFor="density-comfortable">Comfortable (Default)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="spacious" id="density-spacious" />
                                    <Label htmlFor="density-spacious">Spacious</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sidebar</CardTitle>
                        <CardDescription>Configure sidebar behavior.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sidebar-open" className="flex flex-col space-y-1">
                                <span>Default Open</span>
                                <span className="font-normal text-muted-foreground">Sidebar will be open by default on page load.</span>
                            </Label>
                            {/* Using a simple checkbox if Switch is missing, or trying Switch */}
                            <input
                                type="checkbox"
                                id="sidebar-open"
                                checked={sidebarDefaultOpen}
                                onChange={(e) => setSidebarDefaultOpen(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
