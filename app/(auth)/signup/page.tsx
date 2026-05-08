import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <Card className="surface-elevated">
      <CardHeader className="space-y-1.5 text-center pb-2">
        <CardTitle className="text-2xl tracking-tight">Tạo tài khoản</CardTitle>
        <CardDescription>Miễn phí. Bắt đầu lưu từ đầu tiên trong 30 giây.</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
