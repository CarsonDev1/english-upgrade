import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <Card className="surface-elevated">
      <CardHeader className="space-y-1.5 text-center pb-2">
        <CardTitle className="text-2xl tracking-tight">Chào mừng trở lại</CardTitle>
        <CardDescription>Đăng nhập để tiếp tục hành trình học của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
            Tạo tài khoản miễn phí
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
